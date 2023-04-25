/* eslint-disable max-classes-per-file */
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AngularPConnectService } from "../../../_bridge/angular-pconnect";
import { ProgressSpinnerService } from "../../../_messages/progress-spinner.service";
// import * as moment from "moment";
import { Utils } from "../../../_helpers/utils";

import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

const SELECTION_MODE = { SINGLE: 'single', MULTI: 'multi' };

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
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input() pConn$: any;
  @Input() bInForm$: boolean = false;
  @Input() payload;

  repeatList$: MatTableDataSource<any>;
  fields$ : Array<any>;

  tempList: MatTableDataSource<any>;

  displayedColumns$ = Array<string>();
  groupByColumns$: Array<string> = [];


  configProps: any;

  updatedRefList: any;

  repeatListData: Array<any>;

  searchIcon$: string;

  PCore$: any;

  bShowSearch$: boolean = false;
  bColumnReorder$: boolean = false;
  bGrouping$: boolean = false;

  perfFilter: string;
  searchFilter: string;

  

  menuSvgIcon$: string;
  arrowSvgIcon$: string = "";
  arrowDownSvgIcon$: string;
  arrowUpSvgIcon$: string;

  filterSvgIcon$: string;
  filterOnSvgIcon$: string;
  groupBySvgIcon$: string;

  compareType: string;
  compareRef: string;
  arrowDirection: string;

  

  filterByColumns : Array<any> = [];
  bShowFilterPopover$: boolean = false;
  bContains$: boolean = true;
  bDateTime$: boolean = false;

  filterContainsLabel$: string = "";
  filterContainsType$: string = "contains";
  filterContainsValue$: any;

  bIsDate$: boolean = false;
  bIsDateTime$: boolean = false;
  bIsTime$: boolean = false;

  currentFilterRefData: any;
  currentFilterImageEl: any;

  arFilterMainButtons$: Array<any> = [];
  arFilterSecondaryButtons$: Array<any> = [];
  selectionMode: string;
  singleSelectionMode: boolean;
  multiSelectionMode: boolean;
  rowID: any;
  response: any;
  compositeKeys: any;
  constructor(private psService: ProgressSpinnerService,
              private utils: Utils) { 


  }

  ngOnInit(): void {

    if (!this.PCore$) {
      this.PCore$ = window.PCore;
    }

    this.configProps = this.pConn$.getConfigProps();
    /** By default, pyGUID is used for Data classes and pyID is for Work classes as row-id/key */
    const defRowID = this.configProps?.referenceType === 'Case' ? 'pyID' : 'pyGUID';
    /** If compositeKeys is defined, use dynamic value, else fallback to pyID or pyGUID. */
    this.compositeKeys = this.configProps?.compositeKeys;
    this.rowID = this.compositeKeys && this.compositeKeys?.length === 1 ? this.compositeKeys[0] : defRowID;
    this.bShowSearch$ = this.utils.getBooleanValue(this.configProps.globalSearch);
    this.bColumnReorder$ = this.utils.getBooleanValue(this.configProps.reorderFields);
    this.bGrouping$ = this.utils.getBooleanValue(this.configProps.grouping);

    this.menuSvgIcon$ = this.utils.getImageSrc("more", this.PCore$.getAssetLoader().getStaticServerUrl());
    this.arrowDownSvgIcon$ = this.utils.getImageSrc("arrow-down", this.PCore$.getAssetLoader().getStaticServerUrl());
    this.arrowUpSvgIcon$ = this.utils.getImageSrc("arrow-up", this.PCore$.getAssetLoader().getStaticServerUrl());

    this.filterSvgIcon$ = this.utils.getImageSrc("filter", this.PCore$.getAssetLoader().getStaticServerUrl());
    this.filterOnSvgIcon$ = this.utils.getImageSrc("filter-on", this.PCore$.getAssetLoader().getStaticServerUrl());
    this.groupBySvgIcon$ = this.utils.getImageSrc("row", this.PCore$.getAssetLoader().getStaticServerUrl());

    this.selectionMode = this.configProps.selectionMode;

    this.arFilterMainButtons$.push({ actionID: "submit", jsAction: "submit", name: "Submit"});
    this.arFilterSecondaryButtons$.push({ actionID: "cancel", jsAction: "cancel", name: "Cancel"});

    this.searchIcon$ = this.utils.getImageSrc("search", this.PCore$.getAssetLoader().getStaticServerUrl());
    this.getListData();
  }

  getListData() {
    const componentConfig = this.pConn$.getComponentConfig();
    if (this.configProps) {
      const refList = this.configProps?.referenceList;

      // returns a promise
      const workListData = this.PCore$.getDataApiUtils().getData(refList, this.payload);
      
      this.bShowFilterPopover$ = false;

      workListData.then( (workListJSON: Object) => {

        // don't update these fields until we return from promise
        this.fields$ = this.configProps.presets[0].children[0].children;
        // this is an unresovled version of this.fields$, need unresolved, so can get the property reference
        let columnFields = componentConfig.presets[0].children[0].children;

        const tableDataResults = workListJSON["data"].data;

        this.displayedColumns$ = this.getDisplayColums(columnFields);
        this.fields$ = this.updateFields(this.fields$, this.displayedColumns$);
        this.response = tableDataResults;
        this.updatedRefList = this.updateData(tableDataResults, this.fields$);
        if (this.selectionMode === SELECTION_MODE.SINGLE && this.updatedRefList?.length > 0) {
          this.displayedColumns$?.unshift('select');
          this.singleSelectionMode = true;
        } else if (this.selectionMode === SELECTION_MODE.MULTI && this.updatedRefList?.length > 0) {
          this.displayedColumns$?.unshift('select');
          this.multiSelectionMode = true;
        }

        this.repeatList$ = new MatTableDataSource(this.updatedRefList);
        this.repeatList$.filterPredicate = this.customFilterPredicate.bind(this);

        // keeping an original copy to get back after possible sorts, filters and groupBy
        this.repeatListData = this.repeatList$.data.slice();

        this.repeatList$.paginator = this.paginator;
        this.repeatList$.sort = this.sort;
        
      });
    }
    
  }

  ngOnChanges(changes) {
    if (changes && changes.payload) {
      const currentPayloadVal = changes.payload?.currentValue;
      const previousPayloadVal = changes.payload?.previousValue;
      if (currentPayloadVal !== previousPayloadVal) {
        this.getListData();
      }
    }
  }



  ngOnDestroy() {


  }

  ngAfterViewInit() {


    // paginator has to exist for this to work,
    // so called after init (paginator drawn)
    // Calls are now in workListData promise
    // this.repeatList$.paginator = this.paginator;
    // this.repeatList$.sort = this.sort;
  }



  drop(event: CdkDragDrop<Array<string>>) {
    moveItemInArray(this.displayedColumns$, event.previousIndex, event.currentIndex);
  }


  updateFields(arFields, arColumns) : Array<any> {
    let arReturn = arFields;
    for (let i in arReturn) {
      arReturn[i].config.name = arColumns[i];
    }

    return arReturn;
  }



 

  applySearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchFilter = filterValue.trim().toLowerCase();



    if (this.groupByColumns$.length > 0) {
      this.repeatList$.data = this.repeatListData.slice();
      this.repeatList$.filter = this.searchFilter;
      let repeatData = this.repeatList$.sortData(this.repeatList$.filteredData, this.repeatList$.sort);
      this.repeatList$.data = this.addGroups(repeatData, this.groupByColumns$);

      this.perfFilter = performance.now().toString();
      this.repeatList$.filter = this.perfFilter;

    }
    else {
      this.repeatList$.filter = this.searchFilter;
    }

    if (this.repeatList$.paginator) {
      this.repeatList$.paginator.firstPage();
    }
  }

  fieldOnChange(row) {
    const value = row[this.rowID];
    const reqObj = {};
    if (this.compositeKeys?.length > 1) {
      const index = this.response.findIndex(element => element[this.rowID] === value);
      const selectedRow = this.response[index];
      this.compositeKeys.forEach(element => {
        reqObj[element] = selectedRow[element]
      });
    } else {
      reqObj[this.rowID] = value;
    }
    this.pConn$?.getListActions?.()?.setSelectedRows([reqObj]);
  }

  onCheckboxClick(row, event) {
    const value = row[this.rowID];
    const checked = event?.checked;
    const reqObj = {};
    if (this.compositeKeys?.length > 1) {
      const index = this.response.findIndex(element => element[this.rowID] === value);
      const selectedRow = this.response[index];
      this.compositeKeys.forEach(element => {
        reqObj[element] = selectedRow[element]
      });
      reqObj['$selected'] = checked;
    } else {
      reqObj[this.rowID] = value;
      reqObj['$selected'] = checked;
    }
    this.pConn$?.getListActions()?.setSelectedRows([reqObj]);
  }

  rowClick(row) {

    switch (this.configProps.rowClickAction) {
      case "openAssignment" :
        this.psService.sendMessage(true);
        this.openAssignment(row);
        break;

    }
    
  }

  _getIconStyle(level) : string {
    let sReturn = "";
    let nLevel = parseInt(level);
    nLevel --;
    nLevel = nLevel * 15;
    sReturn = "padding-left: " + nLevel + "px; vertical-align: middle";


    return sReturn;
  }

  _getGroupName(fieldName) {
    for (let i in this.fields$) {
      let field = this.fields$[i];
      if (field.config.name == fieldName) {
        return field.config.label;
      }
    }

    return "";
  }

  _showButton(name, row) {
    let bReturn = false;
    const { pxRefObjectClass, pzInsKey, pxRefObjectKey } = row;
    switch (name) {
      case "pxTaskLabel":
        if (pxRefObjectClass != "" && pzInsKey != "") {
          bReturn = true;
        }
        break;
      case "pxRefObjectInsName":
        if (pxRefObjectClass != "" && pxRefObjectKey != "") {
          bReturn = true;
        }
        break
    }

    return bReturn;
  }

  _listViewClick(name, value, index) {

    switch(name) {
      case "pxTaskLabel":
        this.openAssignment(this.repeatList$.data[index]);
        break;
      case "pxRefObjectInsName":
        this.openWork(this.repeatList$.data[index]);
        break;
    }


  }



  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  _headerSortClick(event, columnData) {
    // images 0 - filter, 1 - arrow, 2 - more

    let arrowImage = event.srcElement.getElementsByTagName("img")[1];
    let arrowAttr = arrowImage.getAttribute("arrow");

    this.clearOutArrows(event, columnData);

    switch(arrowAttr) {
      case "up" :
          arrowImage.src = this.arrowDownSvgIcon$;
          arrowImage.setAttribute("arrow", "down");
          break;
      case "down" :
          arrowImage.src = "";
          arrowImage.setAttribute("arrow", "none");
          break;
      default: 
          arrowImage.src = this.arrowUpSvgIcon$;
          arrowImage.setAttribute("arrow", "up");
          break;
    }

    this.compareType = columnData.type;
    this.compareRef = columnData.config.name;
    this.arrowDirection = arrowImage.getAttribute("arrow");

    this.filterSortGroupBy();
    
  }

  clearOutArrows(event, columnData) {
    let arImages = event.srcElement.parentElement.getElementsByTagName("img");

      for (let theImage of arImages) {
      //let theImage = arImages[i]
      let arrow = theImage.getAttribute("arrow");
      if (arrow) {
        let arrowId = theImage.getAttribute("arrowid");
        if (arrow != "none" && arrowId != columnData.config.name) {
          theImage.setAttribute("arrow", "none");
          theImage.src = "";
        }
      }
    }

  }


  sortCompare(a, b) : number {

    let aValue = a[this.compareRef];
    let bValue = b[this.compareRef];

    if (this.compareType == "Date" || this.compareType == "DateTime") {
      aValue = this.utils.getSeconds(aValue);
      bValue = this.utils.getSeconds(bValue);
    }

    if (this.compareRef == "pxRefObjectInsName") {
      const prefixX = aValue.split("-");
      const prefixY = bValue.split("-");
      switch(this.arrowDirection) {
        case "up":
          if (prefixX[0] !== prefixY[0]) {
            if (prefixX[0] < prefixY[0]) return -1;
            if (prefixX[0] > prefixY[0]) return 1;
            return 0;
          }
          return prefixX[1] - prefixY[1];
          break;
        case "down":
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
      case "up" :
        if (aValue < bValue) {
          return -1;
        }
        else if (aValue > bValue) {
          return 1
        }
        break;
      case "down" :
        if (aValue> bValue) {
          return -1;
        }
        else if (aValue < bValue) {
          return 1
        }
        break;
    }


    return 0;

  }

  updateFilterDisplay(type) {
    switch(type) {
      case "Date":
        this.filterContainsType$ = "notequal";
        this.bContains$ = false;
        this.bDateTime$ = true;
        this.bIsDate$ = true;
        this.bIsDateTime$ = false;
        this.bIsTime$ = false;
        break;
      case "DateTime":
        this.filterContainsType$ = "notequal";
        this.bContains$ = false;
        this.bDateTime$ = true;
        this.bIsDate$ = false;
        this.bIsDateTime$ = true;
        this.bIsTime$ = false;
        break;
      case "Time":
        this.filterContainsType$ = "notequal";
        this.bContains$ = false;
        this.bDateTime$ = true;
        this.bIsDate$ = false;
        this.bIsDateTime$ = false;
        this.bIsTime$ = true;
        break;
      default:
        this.filterContainsType$ = "contains";
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
      if (event.path[i].className == "psdk-modal-file-top" || event.path[i].tagName == "BUTTON" ||
          event.path[i].tagName == "MAT-OPTION" || event.path[i].tagName == "MAT-INPUT") {
        bInPopUp = true;
        break;
      }
    }
    if (!bInPopUp) {

        this.bShowFilterPopover$ = false
    
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
      case "cancel" :
        this.currentFilterRefData = [];
        break;
      case "submit":
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
      if (filterObj["ref"] === this.currentFilterRefData.config.name) {
        filterObj["type"] = this.currentFilterRefData.type;
        filterObj["containsFilter"] = this.filterContainsType$;
        filterObj["containsFilterValue"] = this.filterContainsValue$;

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
      let containsFilterValue = filterObj["containsFilterValue"];
      let containsFilter = filterObj["containsFilter"];
      let filterRef = filterObj["ref"];
      let filterIndex = this.displayedColumns$.indexOf(filterRef);
      let arFilterImg = document.getElementsByName("filterOnIcon");
      let filterImg: any = arFilterImg[filterIndex];
      if (containsFilterValue == "" && containsFilter != 'null' && containsFilter != 'notnull') {
        // clear icon
        filterImg.src = "";
      }
      else {
        // show icon
        filterImg.src = this.filterOnSvgIcon$;
      }

    }

  }

  updateFilterVarsWithCurrent(columnData) {
    // find current ref, if exists, move data to variable to display

    let bFound = false;
    for (let filterObj of this.filterByColumns) {
      if (filterObj["ref"] === this.currentFilterRefData.config.name) {
        this.filterContainsType$ = filterObj["containsFilter"];
        this.filterContainsValue$ = filterObj["containsFilterValue"];

        bFound = true;
        break;
      }
    }

    if (!bFound) {
      switch( columnData.type) {
        case "Date":
        case "DateTime":
        case "Time":
          this.filterContainsType$ = "notequal";
          break;
        default:
          this.filterContainsType$ = "contains";
          break;
      }
      
      this.filterContainsValue$ = "";
    }
  }

  filterData(item: any) {
    let bKeep = true; 
    for (let filterObj of this.filterByColumns) {
      if (filterObj.containsFilterValue != ""  || filterObj.containsFilter == 'null' || filterObj.containsFilter == 'notnull') {
        let value : any;
        let filterValue: any;

        switch (filterObj.type) {
          case "Date":
          case "DateTime":
          case "Time":
            value = (item[filterObj.ref] != null ?? item[filterObj.ref] != "") ? this.utils.getSeconds(item[filterObj.ref]) : null;
            filterValue = (filterObj.containsFilterValue != null && filterObj.containsFilterValue != "") ? this.utils.getSeconds(filterObj.containsFilterValue) : null;

            switch(filterObj.containsFilter) {
              case "notequal":
                // becasue filterValue is in minutes, need to have a range of less than 60 secons

                if (value != null && filterValue != null) {
                  // get rid of millisecons
                  value = value / 1000;
                  filterValue = filterValue / 1000;

                  let diff = value - filterValue;
                  if  (diff >= 0 && diff < 60) {
                    bKeep = false;
                  }
                }

                break;
              case "after":
                if (value < filterValue) {
                  bKeep = false;
                }
                break;
              case "before":
                if (value > filterValue) {
                  bKeep = false;
                }
                break;
              case "null":
                if (value != null) {
                  bKeep = false;
                }
                break;
              case "notnull":
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
              case "contains":
                if (value.indexOf(filterValue) < 0) {
                  bKeep = false;
                }
                break;
              case "equals":
                if (value != filterValue) {
                  bKeep = false;
                }
                break;
              case "startswith":
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



  filterSortGroupBy() {

    // get original data set
    let theData = this.repeatListData.slice();

    // last filter config data is global
    theData = theData.filter( this.filterData.bind(this) );

    // last sort config data is global
    theData.sort( this.sortCompare.bind(this) );

    let reGroupData = this.addGroups(theData, this.groupByColumns$);

    this.repeatList$.data = [];
    this.repeatList$.data.push( ...reGroupData);


    if (this.searchFilter && this.searchFilter != "") {
      this.repeatList$.filter = this.searchFilter;
    }
    else {
      this.perfFilter = performance.now().toString();
      this.repeatList$.filter = this.perfFilter;
    }
    this.repeatList$.filter = "";

    if (this.repeatList$.paginator) {
      this.repeatList$.paginator.firstPage();
    }
  }


  //
  // Grouping code inspired by this example
  // https://stackblitz.com/edit/angular-material-table-row-grouping
  //

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

  checkGroupByColumn(field, add ) {
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
      if ( add ) {
        this.groupByColumns$.push(field);
      }
    }
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
      data.map(
        row => {
          const result = new Group();
          result.level = level + 1;
          result.parent = parent;
          for (let i = 0; i <= level; i++) {
            result[groupByColumns[i]] = row[groupByColumns[i]];
          }
          return result;
        }
      ),
      JSON.stringify);

    const currentColumn = groupByColumns[level];
    let subGroups = [];
    groups.forEach(group => {
      const rowsInGroup = data.filter(row => group[currentColumn] === row[currentColumn]);
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
    this.repeatList$.filter = this.perfFilter;
  }


  // below is for grid row grouping
  customFilterPredicate(data: any | Group, filter: string): boolean {
    return data instanceof Group ? data.visible : this.getDataRowVisibleWithFilter(data, filter);
  }

  getDataRowVisible(data: any): boolean {
    const groupRows = this.repeatList$.data.filter(row => {
      if (!(row instanceof Group)) {
        return false;
      }
      let match = true;
      this.groupByColumns$.forEach(column => {
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

    if (bVisible && filter && filter != "" && filter != this.perfFilter) {
      // now check if row is filtered.

      // assume not there unless we find it
      bVisible = false;
      for (let col of this.displayedColumns$) {
        // filter is lower case
        if (data[col] && data[col].toString().toLowerCase().indexOf(filter) >= 0) {
          bVisible = true;
          break;
        }
      }

    }


    return bVisible;
  }


  updateData( listData:Array<any>, fieldData:Array<any>): Array<any> {
    let returnList : Array<any> = new Array<any>();
    for ( let row in listData) {
       // copy
      let rowData = JSON.parse(JSON.stringify(listData[row]));


      for (let field in fieldData) {
        let config = fieldData[field].config
        let fieldName;
        let formattedDate;
        let myFormat;

        switch (fieldData[field].type) {
          case "Date" :
            fieldName = config.name;
            myFormat = config.formatter;
            if (!myFormat) {
              myFormat = "Date";
            }
            formattedDate = this.utils.generateDate(rowData[fieldName], myFormat);

            rowData[fieldName] = formattedDate;
            break;
          case "DateTime" :
            fieldName = config.name;
            myFormat = config.formatter;
            if (!myFormat) {
              myFormat = "DateTime-Long";
            }
            formattedDate = this.utils.generateDateTime(rowData[fieldName], myFormat);

            rowData[fieldName] = formattedDate;
            break;
        }

      }

      returnList.push(rowData);
    }

    return returnList;
  }

  openAssignment(row) {
    const { pxRefObjectClass, pzInsKey } = row;
    let sTarget = this.pConn$.getContainerName();


    let options = { "containerName" : sTarget};

    this.pConn$.getActionsApi().openAssignment(pzInsKey, pxRefObjectClass, options);
  }

  openWork(row) {
    const {pxRefObjectClass, pxRefObjectKey} = row;

    if (pxRefObjectClass != "" && pxRefObjectKey != "") {
      this.pConn$.getActionsApi().openWorkByHandle( pxRefObjectKey, pxRefObjectClass);
    }
  }

  
  initializeData(data) {
    data.forEach((item, idx) => {
      item.__original_index = idx;
      item.__level = 1;
    });
  
    return data;
  }
   
  getType(field) {
    const { config = {}, type } = field;
    const { formatType } = config;
    if (formatType === "datetime" || formatType === "date") {
      // currently cosmos has only support for date ... it also need to support dateTime
      return "date";
    }
    return type.toLowerCase();
  }
  
  initializeColumns(fields = []) {
    return fields.map((field, originalColIndex) => ({
      ...field,
      type: this.getType(field),
      name: field.config.value.substring(4),
      label: field.config.label.substring(3),
      id: originalColIndex,
      groupingEnabled: true,
      grouped: false,
      minWidth: 50,
      cellRenderer: this.getType(field) === "text" ? null : field.type,
      filter: true,
    }));
  }

  getDisplayColums(fields = []) {
    let arReturn = fields.map(( field, colIndex) => {
      let theField = field.config.value.substring(field.config.value.indexOf(" ")+1);
      if (theField.indexOf(".") == 0) {
        theField = theField.substring(1);
      }

      return theField;
    });
    return arReturn;
 
  }

}
