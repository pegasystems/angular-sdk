/* eslint-disable max-classes-per-file */
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AngularPConnectService } from '../../../_bridge/angular-pconnect';
import { Utils } from '../../../_helpers/utils';
import { getContext, buildFieldsForTable } from './helpers';
import { DatapageService } from 'src/app/_services/datapage.service';
import { FieldGroupUtils } from '../../../_helpers/field-group-utils';
import { MatTableDataSource } from '@angular/material/table';

export class Group {
  level = 0;
  parent: Group;
  expanded = true;
  totalCounts = 0;
  get visible(): boolean {
    return !this.parent || (this.parent.visible && this.parent.expanded);
  }
}

@Component({
  selector: 'app-simple-table-manual',
  templateUrl: './simple-table-manual.component.html',
  styleUrls: ['./simple-table-manual.component.scss'],
})
export class SimpleTableManualComponent implements OnInit {
  @Input() pConn$: any;
  @Input() formGroup$: FormGroup;

  // Used with AngularPConnect
  angularPConnectData: any = {};
  PCore$: any;
  configProps$: any;

  fields$: Array<any>;

  bVisible$: boolean = true;
  displayedColumns: Array<string> = [];
  rowData: MatTableDataSource<any>;
  originalData: Array<any> = [];
  processedFields: Array<any> = [];
  fieldDefs: Array<any> = [];
  requestedReadOnlyMode: boolean = false;
  readOnlyMode: boolean = false;
  editableMode: boolean;
  menuIconOverride$: string;
  pageReference: string;
  referenceList: any;
  contextClass: any;
  showAddRowButton: boolean;
  prevRefLength: number;
  elementsData: MatTableDataSource<any>;
  rawFields: any;
  label: string = '';
  searchIcon$: string;

  bShowSearch$: boolean = false;
  bColumnReorder$: boolean = false;
  bGrouping$: boolean = false;

  perfFilter: string;
  searchFilter: string;

  menuSvgIcon$: string;
  arrowSvgIcon$: string = '';
  arrowDownSvgIcon$: string;
  arrowUpSvgIcon$: string;

  filterSvgIcon$: string;
  filterOnSvgIcon$: string;
  groupBySvgIcon$: string;

  // displayedColumns$ = Array<string>();
  groupByColumns$: Array<string> = [];
  compareType: string;
  compareRef: string;
  arrowDirection: string = 'down';
  filterByColumns: Array<any> = [];
  currentFilterRefData: any;
  filterContainsLabel$: string = '';
  filterContainsType$: string = 'contains';
  filterContainsValue$: any;
  bShowFilterPopover$: boolean = false;
  bContains$: boolean = true;
  bDateTime$: boolean = false;

  bIsDate$: boolean = false;
  bIsDateTime$: boolean = false;
  bIsTime$: boolean = false;
  currentFilterImageEl: any;

  arFilterMainButtons$: Array<any> = [];
  arFilterSecondaryButtons$: Array<any> = [];
  selectionMode: string;
  singleSelectionMode: boolean;
  multiSelectionMode: boolean;
  rowID: any;
  response: any;
  compositeKeys: any;

  constructor(
    private angularPConnect: AngularPConnectService,
    private utils: Utils,
    private dataPageService: DatapageService,
    private fieldGroupUtils: FieldGroupUtils
  ) {}

  ngOnInit(): void {
    // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);
    if (!this.PCore$) {
      this.PCore$ = window.PCore;
    }
    this.configProps$ = this.pConn$.getConfigProps();
    // Then, continue on with other initialization
    this.menuIconOverride$ = this.utils.getImageSrc('trash', this.utils.getSDKStaticContentUrl());
    // call checkAndUpdate when initializing
    this.checkAndUpdate();
    this.filterSvgIcon$ = this.utils.getImageSrc('filter', this.utils.getSDKStaticContentUrl());
    this.filterOnSvgIcon$ = this.utils.getImageSrc('filter-on', this.utils.getSDKStaticContentUrl());
    this.groupBySvgIcon$ = this.utils.getImageSrc('row', this.utils.getSDKStaticContentUrl());
    this.bGrouping$ = this.utils.getBooleanValue(this.configProps$.grouping);
    this.menuSvgIcon$ = this.utils.getImageSrc('more', this.utils.getSDKStaticContentUrl());
    

    this.arFilterMainButtons$.push({ actionID: 'submit', jsAction: 'submit', name: 'Submit' });
    this.arFilterSecondaryButtons$.push({ actionID: 'cancel', jsAction: 'cancel', name: 'Cancel' });

    this.searchIcon$ = this.utils.getImageSrc('search', this.utils.getSDKStaticContentUrl());
  }

  ngOnDestroy(): void {
    if (this.angularPConnectData.unsubscribeFn) {
      this.angularPConnectData.unsubscribeFn();
    }
  }

  checkAndUpdate() {
    // Should always check the bridge to see if the component should
    // update itself (re-render)
    const bUpdateSelf = this.angularPConnect.shouldComponentUpdate(this);

    // ONLY call updateSelf when the component should update
    if (bUpdateSelf) {
      this.updateSelf();
    }
  }

  // updateSelf
  updateSelf(): void {
    // moved this from ngOnInit() and call this from there instead...
    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());

    if (this.configProps$['visibility'] != null) {
      // eslint-disable-next-line no-multi-assign
      this.bVisible$ = this.bVisible$ = this.utils.getBooleanValue(this.configProps$['visibility']);
    }

    // NOTE: getConfigProps() has each child.config with datasource and value undefined
    //  but getRawMetadata() has each child.config with datasource and value showing their unresolved values (ex: "@P thePropName")
    //  We need to use the prop name as the "glue" to tie the Angular Material table dataSource, displayColumns and data together.
    //  So, in the code below, we'll use the unresolved config.value (but replacing the space with an underscore to keep things happy)
    const rawMetadata = this.pConn$.getRawMetadata();

    // Adapted from Nebula
    const {
      label,
      showLabel,
      referenceList = [], // if referenceList not in configProps$, default to empy list
      renderMode,
      children, // destructure children into an array var: "resolvedFields"
      presets,
      allowTableEdit,
      labelProp,
      propertyLabel,
    } = this.configProps$;

    this.label = labelProp || propertyLabel;

    const hideAddRow = allowTableEdit === false ? true : false;
    const hideDeleteRow = allowTableEdit === false ? true : false;
    let { contextClass } = this.configProps$;
    this.referenceList = referenceList;
    if (!contextClass) {
      let listName = this.pConn$.getComponentConfig().referenceList;
      listName = this.PCore$.getAnnotationUtils().getPropertyName(listName);
      contextClass = this.pConn$.getFieldMetadata(listName)?.pageClass;
    }
    this.contextClass = contextClass;

    const resolvedFields = children?.[0]?.children || presets?.[0].children?.[0].children;
    // get raw config as @P and other annotations are processed and don't appear in the resolved config.
    //  Destructure "raw" children into array var: "rawFields"
    //  NOTE: when config.listType == "associated", the property can be found in either
    //    config.value (ex: "@P .DeclarantChoice") or
    //    config.datasource (ex: "@ASSOCIATED .DeclarantChoice")
    //  Neither of these appear in the resolved (this.configProps$)
    const rawConfig = rawMetadata?.config;
    const rawFields = rawConfig?.children?.[0]?.children || rawConfig?.presets?.[0].children?.[0]?.children;
    this.rawFields = rawFields;
    // At this point, fields has resolvedFields and rawFields we can use

    // start of from Nebula
    // get context name and referenceList which will be used to prepare config of PConnect
    const { contextName, referenceListStr, pageReferenceForRows } = getContext(this.pConn$);

    const resolvedList = this.fieldGroupUtils.getReferenceList(this.pConn$);
    this.pageReference = `${this.pConn$.getPageReference()}${resolvedList}`;
    this.pConn$.setReferenceList(resolvedList);

    // This gives up the "properties" we need to map to row/column values later
    // const processedData = populateRowKey(referenceList);

    this.requestedReadOnlyMode = renderMode === 'ReadOnly';
    this.readOnlyMode = renderMode === 'ReadOnly';
    this.editableMode = renderMode === 'Editable';
    this.showAddRowButton = !this.readOnlyMode && !hideAddRow;
    const showDeleteButton = !this.readOnlyMode && !hideDeleteRow;

    // Nebula has other handling for isReadOnlyMode but has Cosmos-specific code
    //  so ignoring that for now...
    // fieldDefs will be an array where each entry will have a "name" which will be the
    //  "resolved" property name (that we can use as the colId) though it's not really
    //  resolved. The buildFieldsForTable helper just removes the "@P " (which is what
    //  Nebula does). It will also have the "label", and "meta" contains the original,
    //  unchanged config info. For now, much of the info here is carried over from
    //  Nebula and we may not end up using it all.
    this.fieldDefs = buildFieldsForTable(rawFields, resolvedFields, showDeleteButton);

    // end of from Nebula

    // Here, we use the "name" field in fieldDefs since that has the assoicated property
    //  (if one exists for the field). If no "name", use "cellRenderer" (typically get DELETE_ICON)
    //  for our columns.
    this.displayedColumns = this.fieldDefs?.map((field) => {
      return field.name ? field.name : field.cellRenderer;
    });

    // And now we can process the resolvedFields to add in the "name"
    //  from from the fieldDefs. This "name" is the value that
    //  we'll share to connect things together in the table.

    this.processedFields = [];

    this.processedFields = resolvedFields.map((field, i) => {
      field.config['name'] = this.displayedColumns[i]; // .config["value"].replace(/ ./g,"_");   // replace space dot with underscore
      return field;
    });

    if (this.prevRefLength !== this.referenceList?.length) {
      if (this.editableMode) {
        this.buildElementsForTable();
      } else {
        this.generateRowsData();
      }
    }

    this.prevRefLength = this.referenceList?.length;

    // These are the data structures referred to in the html file.
    //  These are the relationships that make the table work
    //  displayedColumns: key/value pairs where key is order of column and
    //    value is the property shown in that column. Ex: 1: "FirstName"
    //  processedFields: key/value pairs where each key is order of column
    //    and each value is an object of more detailed information about that
    //    column.
    //  rowData: array of each row's key/value pairs. Inside each row,
    //    each key is an entry in displayedColumns: ex: "FirstName": "Charles"
    //    Ex: { 1: {config: {label: "First Name", readOnly: true: name: "FirstName"}}, type: "TextInput" }
    //    The "type" indicates the type of component that should be used for editing (when editing is enabled)
    //
    //  Note that the "property" shown in the column ("FirstName" in the above examples) is what
    //  ties the 3 data structures together.
  }

  getResultsText(){
    const recordsCount = this.readOnlyMode ? this.rowData?.data.length : this.referenceList?.length;
    return `${recordsCount} result${recordsCount > 1 ? 's' : ''}`;
  }  

  sortCompare(a, b): number {
    let aValue = a[this.compareRef];
    let bValue = b[this.compareRef];

    if (this.compareType == 'Date' || this.compareType == 'DateTime') {
      aValue = this.utils.getSeconds(aValue);
      bValue = this.utils.getSeconds(bValue);
    }

    if (this.compareRef == 'pxRefObjectInsName') {
      const prefixX = aValue.split('-');
      const prefixY = bValue.split('-');
      switch (this.arrowDirection) {
        case 'up':
          if (prefixX[0] !== prefixY[0]) {
            if (prefixX[0] < prefixY[0]) return -1;
            if (prefixX[0] > prefixY[0]) return 1;
            return 0;
          }
          return prefixX[1] - prefixY[1];
          break;
        case 'down':
          if (prefixX[0] !== prefixY[0]) {
            if (prefixX[0] > prefixY[0]) return -1;
            if (prefixX[0] < prefixY[0]) return 1;
            return 0;
          }
          return prefixY[1] - prefixX[1];
          break;
      }
    }

    switch (this.arrowDirection) {
      case 'up':
        if (aValue < bValue) {
          return -1;
        } else if (aValue > bValue) {
          return 1;
        }
        break;
      case 'down':
        if (aValue > bValue) {
          return -1;
        } else if (aValue < bValue) {
          return 1;
        }
        break;
    }

    return 0;
  }

  updateFilterDisplay(type) {
    switch (type) {
      case 'Date':
        this.filterContainsType$ = 'notequal';
        this.bContains$ = false;
        this.bDateTime$ = true;
        this.bIsDate$ = true;
        this.bIsDateTime$ = false;
        this.bIsTime$ = false;
        break;
      case 'DateTime':
        this.filterContainsType$ = 'notequal';
        this.bContains$ = false;
        this.bDateTime$ = true;
        this.bIsDate$ = false;
        this.bIsDateTime$ = true;
        this.bIsTime$ = false;
        break;
      case 'Time':
        this.filterContainsType$ = 'notequal';
        this.bContains$ = false;
        this.bDateTime$ = true;
        this.bIsDate$ = false;
        this.bIsDateTime$ = false;
        this.bIsTime$ = true;
        break;
      default:
        this.filterContainsType$ = 'contains';
        this.bContains$ = true;
        this.bDateTime$ = false;
        this.bIsDate$ = false;
        this.bIsDateTime$ = false;
        this.bIsTime$ = false;
        break;
    }
  }

  _filter(event, columnData) {
    // add clickAway listener
    window.addEventListener('mouseup', this._clickAway.bind(this));

    this.currentFilterRefData = columnData;
    this.filterContainsLabel$ = columnData.config.label;

    setTimeout(() => {
      this.updateFilterDisplay(columnData.type);

      this.updateFilterVarsWithCurrent(columnData);

      this.bShowFilterPopover$ = true;
    });
  }

  _clickAway(event: any) {
    var bInPopUp = false;

    //run through list of elements in path, if menu not in th path, then want to
    // hide (toggle) the menu
    for (let i in event.path) {
      if (
        event.path[i].className == 'psdk-modal-file-top' ||
        event.path[i].tagName == 'BUTTON' ||
        event.path[i].tagName == 'MAT-OPTION' ||
        event.path[i].tagName == 'MAT-INPUT'
      ) {
        bInPopUp = true;
        break;
      }
    }
    if (!bInPopUp) {
      // this.bShowFilterPopover$ = false;

      window.removeEventListener('mouseup', this._clickAway.bind(this));
    }
  }

  _filterContainsType(event) {
    this.filterContainsType$ = event.value;
  }

  _filterContainsValue(event) {
    this.filterContainsValue$ = event.target.value;
  }

  _filterContainsDateValue(event, value) {
    this.filterContainsValue$ = value;
  }

  _filterContainsDateTimeValue(event) {
    this.filterContainsValue$ = event.target.value;
  }

  _filterContainsTimeValue(event) {
    this.filterContainsValue$ = event.target.value;
  }

  _onFilterActionButtonClick(event: any) {
    // modal buttons
    switch (event.action) {
      case 'cancel':
        this.currentFilterRefData = [];
        break;
      case 'submit':
        this.updateFilterWithInfo();
        this.filterSortGroupBy();

        break;
    }

    this.bShowFilterPopover$ = false;

    window.removeEventListener('mouseup', this._clickAway.bind(this));
  }

  updateFilterWithInfo() {
    let bFound = false;
    for (let filterObj of this.filterByColumns) {
      if (filterObj['ref'] === this.currentFilterRefData.config.name) {
        filterObj['type'] = this.currentFilterRefData.type;
        filterObj['containsFilter'] = this.filterContainsType$;
        filterObj['containsFilterValue'] = this.filterContainsValue$;

        bFound = true;
        break;
      }
    }

    if (!bFound) {
      // add in
      let filterObj: any = {};
      filterObj.ref = this.currentFilterRefData.config.name;
      filterObj.type = this.currentFilterRefData.type;
      filterObj.containsFilter = this.filterContainsType$;
      filterObj.containsFilterValue = this.filterContainsValue$;

      this.filterByColumns.push(filterObj);
    }

    // iterate through filters and update filterOn icon
    for (let filterObj of this.filterByColumns) {
      let containsFilterValue = filterObj['containsFilterValue'];
      let containsFilter = filterObj['containsFilter'];
      let filterRef = filterObj['ref'];
      let filterIndex = this.displayedColumns.indexOf(filterRef);
      let arFilterImg = document.getElementsByName('filterOnIcon');
      let filterImg: any = arFilterImg[filterIndex];
      if (containsFilterValue == '' && containsFilter != 'null' && containsFilter != 'notnull') {
        // clear icon
        filterImg.src = '';
      } else {
        // show icon
        filterImg.src = this.filterOnSvgIcon$;
      }
    }
  }

  updateFilterVarsWithCurrent(columnData) {
    // find current ref, if exists, move data to variable to display

    let bFound = false;
    for (let filterObj of this.filterByColumns) {
      if (filterObj['ref'] === this.currentFilterRefData.config.name) {
        this.filterContainsType$ = filterObj['containsFilter'];
        this.filterContainsValue$ = filterObj['containsFilterValue'];

        bFound = true;
        break;
      }
    }

    if (!bFound) {
      switch (columnData.type) {
        case 'Date':
        case 'DateTime':
        case 'Time':
          this.filterContainsType$ = 'notequal';
          break;
        default:
          this.filterContainsType$ = 'contains';
          break;
      }

      this.filterContainsValue$ = '';
    }
  }

  filterData(item: any) {
    let bKeep = true;
    for (let filterObj of this.filterByColumns) {
      if (filterObj.containsFilterValue != '' || filterObj.containsFilter == 'null' || filterObj.containsFilter == 'notnull') {
        let value: any;
        let filterValue: any;

        switch (filterObj.type) {
          case 'Date':
          case 'DateTime':
          case 'Time':
            value = item[filterObj.ref] != null ?? item[filterObj.ref] != '' ? this.utils.getSeconds(item[filterObj.ref]) : null;
            filterValue =
              filterObj.containsFilterValue != null && filterObj.containsFilterValue != ''
                ? this.utils.getSeconds(filterObj.containsFilterValue)
                : null;

            switch (filterObj.containsFilter) {
              case 'notequal':
                // becasue filterValue is in minutes, need to have a range of less than 60 secons

                if (value != null && filterValue != null) {
                  // get rid of millisecons
                  value = value / 1000;
                  filterValue = filterValue / 1000;

                  let diff = value - filterValue;
                  if (diff >= 0 && diff < 60) {
                    bKeep = false;
                  }
                }

                break;
              case 'after':
                if (value < filterValue) {
                  bKeep = false;
                }
                break;
              case 'before':
                if (value > filterValue) {
                  bKeep = false;
                }
                break;
              case 'null':
                if (value != null) {
                  bKeep = false;
                }
                break;
              case 'notnull':
                if (value == null) {
                  bKeep = false;
                }
                break;
            }
            break;
          default:
            value = item[filterObj.ref].toLowerCase();
            filterValue = filterObj.containsFilterValue.toLowerCase();

            switch (filterObj.containsFilter) {
              case 'contains':
                if (value.indexOf(filterValue) < 0) {
                  bKeep = false;
                }
                break;
              case 'equals':
                if (value != filterValue) {
                  bKeep = false;
                }
                break;
              case 'startswith':
                if (value.indexOf(filterValue) != 0) {
                  bKeep = false;
                }
                break;
            }

            break;
        }
      }

      // if don't keep stop filtering
      if (!bKeep) {
        break;
      }
    }

    return bKeep;
  }

  filterSortGroupBy(){
    let theData = this.originalData.slice();

    // last filter config data is global
    theData = theData.filter(this.filterData.bind(this));

    // last sort config data is global
    theData.sort(this.sortCompare.bind(this));
    this.rowData.data = theData;
  }

  _headerSortClick(event, columnData) {
    // images 0 - filter, 1 - arrow, 2 - more

    /** Commenting this code for now as it is giving errors not sure if it ever worked */
    // let arrowImage = event.srcElement.getElementsByTagName('img')[1];
    // let arrowAttr = arrowImage.getAttribute('arrow');

    // this.clearOutArrows(event, columnData);

    // switch (arrowAttr) {
    //   case 'up':
    //     arrowImage.src = this.arrowDownSvgIcon$;
    //     arrowImage.setAttribute('arrow', 'down');
    //     break;
    //   case 'down':
    //     arrowImage.src = '';
    //     arrowImage.setAttribute('arrow', 'none');
    //     break;
    //   default:
    //     arrowImage.src = this.arrowUpSvgIcon$;
    //     arrowImage.setAttribute('arrow', 'up');
    //     break;
    // }

    this.compareType = columnData.type;
    this.compareRef = columnData.config.name;
    // this.arrowDirection = arrowImage.getAttribute('arrow');
    this.arrowDirection = this.arrowDirection === 'up' ? 'down' : 'up';

    this.filterSortGroupBy();
  }

  _showUnGroupBy(columnData): boolean {
    for (let val of this.groupByColumns$) {
      if (val == columnData.config.name) {
        return true;
      }
    }

    return false;
  }

  _groupBy(event, columnData) {
    this.checkGroupByColumn(columnData.config.name, true);

    this.filterSortGroupBy();
  }

  _unGroupBy(event, columnData) {
    //event.stopPropagation();
    this.checkGroupByColumn(columnData.config.name, false);

    this.filterSortGroupBy();
  }

  checkGroupByColumn(field, add) {
    let found = null;
    for (const column of this.groupByColumns$) {
      if (column === field) {
        found = this.groupByColumns$.indexOf(column, 0);
      }
    }
    if (found != null && found >= 0) {
      if (!add) {
        this.groupByColumns$.splice(found, 1);
      }
    } else {
      if (add) {
        this.groupByColumns$.push(field);
      }
    }
  }

  _getGroupName(fieldName) {
    for (let i in this.fields$) {
      let field = this.fields$[i];
      if (field.config.name == fieldName) {
        return field.config.label;
      }
    }

    return '';
  }

  addGroups(data: Array<any>, groupByColumns: Array<string>): Array<any> {
    const rootGroup = new Group();
    rootGroup.expanded = true;
    return this.getSublevel(data, 0, groupByColumns, rootGroup);
  }

  getSublevel(data: Array<any>, level: number, groupByColumns: Array<string>, parent: Group): Array<any> {
    if (level >= groupByColumns.length) {
      return data;
    }
    const groups = this.uniqueBy(
      data.map((row) => {
        const result = new Group();
        result.level = level + 1;
        result.parent = parent;
        for (let i = 0; i <= level; i++) {
          result[groupByColumns[i]] = row[groupByColumns[i]];
        }
        return result;
      }),
      JSON.stringify
    );

    const currentColumn = groupByColumns[level];
    let subGroups = [];
    groups.forEach((group) => {
      const rowsInGroup = data.filter((row) => group[currentColumn] === row[currentColumn]);
      group.totalCounts = rowsInGroup.length;
      const subGroup = this.getSublevel(rowsInGroup, level + 1, groupByColumns, group);
      subGroup.unshift(group);
      subGroups = subGroups.concat(subGroup);
    });
    return subGroups;
  }

  uniqueBy(a, key) {
    const seen = {};
    return a.filter((item) => {
      const k = key(item);
      // eslint-disable-next-line no-return-assign, no-prototype-builtins
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
  }

  isGroup(index, item): boolean {
    return item.level;
  }

  _groupHeaderClick(row) {
    row.expanded = !row.expanded;
    //this.repeatList$.filter = "";
    this.perfFilter = performance.now().toString();
    this.rowData.filter = this.perfFilter;
  }

  // below is for grid row grouping
  customFilterPredicate(data: any | Group, filter: string): boolean {
    return data instanceof Group ? data.visible : this.getDataRowVisibleWithFilter(data, filter);
  }

  getDataRowVisible(data: any): boolean {
    const groupRows = this.rowData.data.filter((row) => {
      if (!(row instanceof Group)) {
        return false;
      }
      let match = true;
      this.groupByColumns$.forEach((column) => {
        if (!row[column] || !data[column] || row[column] !== data[column]) {
          match = false;
        }
      });
      return match;
    });

    if (groupRows.length === 0) {
      return true;
    }
    const parent = groupRows[0] as Group;
    return parent.visible && parent.expanded;
  }

  getDataRowVisibleWithFilter(data, filter) {
    // fist check if row is visible with grouping
    let bVisible = this.getDataRowVisible(data);

    if (bVisible && filter && filter != '' && filter != this.perfFilter) {
      // now check if row is filtered.

      // assume not there unless we find it
      bVisible = false;
      for (let col of this.displayedColumns) {
        // filter is lower case
        if (data[col] && data[col].toString().toLowerCase().indexOf(filter) >= 0) {
          bVisible = true;
          break;
        }
      }
    }

    return bVisible;
  }

  getDisplayColums(fields = []) {
    let arReturn = fields.map((field, colIndex) => {
      let theField = field.config.value.substring(field.config.value.indexOf(' ') + 1);
      if (theField.indexOf('.') == 0) {
        theField = theField.substring(1);
      }

      return theField;
    });
    return arReturn;
  }

  _getIconStyle(level): string {
    let sReturn = '';
    let nLevel = parseInt(level);
    nLevel--;
    nLevel = nLevel * 15;
    sReturn = 'padding-left: ' + nLevel + 'px; vertical-align: middle';

    return sReturn;
  }

  // Callback passed when subscribing to store change
  onStateChange() {
    this.checkAndUpdate();
  }

  // return the value that should be shown as the contents for the given row data
  //  of the given row field
  getRowValue(inRowData: Object, inColKey: string): any {
    // See what data (if any) we have to display
    const refKeys: Array<string> = inColKey.split('.');
    let valBuilder = inRowData;
    for (var key of refKeys) {
      valBuilder = valBuilder[key];
    }
    return valBuilder;
  }

  generateRowsData() {
    const { dataPageName, referenceList } = this.configProps$;
    const context = this.pConn$.getContextName();
    // if dataPageName property value exists then make a datapage fetch call and get the list of data.
    if (dataPageName) {
      this.dataPageService.getDataPageData(dataPageName, context).then((listData) => {
        const data = this.formatRowsData(listData);
        this.originalData = data;
        this.rowData = new MatTableDataSource(data);
      });
    } else {
      // The referenceList prop has the JSON data for each row to be displayed
      //  in the table. So, iterate over referenceList to create the dataRows that
      //  we're using as the table's dataSource
      const data = this.formatRowsData(referenceList);
      this.originalData = data;
      this.rowData = new MatTableDataSource(data);
    }
  }

  formatRowsData(data) {
    return data?.map((item) => {
      return this.displayedColumns.reduce((dataForRow, colKey) => {
        dataForRow[colKey] = this.getRowValue(item, colKey);
        return dataForRow;
      }, {});
    });
  }

  addRecord() {
    if (this.PCore$.getPCoreVersion()?.includes('8.7')) {
      this.pConn$.getListActions().insert({ classID: this.contextClass }, this.referenceList.length, this.pageReference);
    } else {
      this.pConn$.getListActions().insert({ classID: this.contextClass }, this.referenceList.length);
    }
  }

  deleteRecord(index) {
    if (this.PCore$.getPCoreVersion()?.includes('8.7')) {
      this.pConn$.getListActions().deleteEntry(index, this.pageReference);
    } else {
      this.pConn$.getListActions().deleteEntry(index);
    }
  }

  buildElementsForTable() {
    const context = this.pConn$.getContextName();
    const eleData: any = [];
    this.referenceList.forEach((element, index) => {
      const data: any = [];
      this.rawFields?.forEach((item) => {
        const referenceListData = this.fieldGroupUtils.getReferenceList(this.pConn$);
        const isDatapage = referenceListData.startsWith('D_');
        const pageReferenceValue = isDatapage
          ? `${referenceListData}[${index}]`
          : `${this.pConn$.getPageReference()}${referenceListData.substring(referenceListData.lastIndexOf('.'))}[${index}]`;
        const config = {
          meta: item,
          options: {
            context,
            pageReference: pageReferenceValue,
            referenceList: referenceListData,
            hasForm: true,
          },
        };
        const view = this.PCore$.createPConnect(config);
        data.push(view);
      });
      eleData.push(data);
    });
    this.elementsData = eleData;
  }
}
