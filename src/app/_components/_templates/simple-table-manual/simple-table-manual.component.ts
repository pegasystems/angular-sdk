import { Component, OnInit, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Utils } from "../../../_helpers/utils";
import { AngularPConnectService } from "../../../_bridge/angular-pconnect";
import { getContext, populateRowKey, buildFieldsForTable } from "./helpers";
import { DatapageService } from "src/app/_services/datapage.service";
import { FieldGroupUtils } from '../../../_helpers/field-group-utils';

@Component({
  selector: 'app-simple-table-manual',
  templateUrl: './simple-table-manual.component.html',
  styleUrls: ['./simple-table-manual.component.scss']
})
export class SimpleTableManualComponent implements OnInit {
  @Input() pConn$: any;
  @Input() formGroup$: FormGroup;

  bVisible$: boolean = true;

  configProps$: any;

  displayedColumns: Array<string> = [];
  rowData: Array<any> = [];
  processedFields: Array<any> = [];
  fieldDefs: Array<any> = [];
  requestedReadOnlyMode: boolean = false;
  readOnlyMode: boolean = false;
  editableMode: boolean;
  // Used with AngularPConnect
  angularPConnectData: any = {};
  PCore$: any;
  menuIconOverride$: string;
  pageReference: string;
  referenceList: any;
  contextClass: any;
  showAddRowButton: boolean;
  prevRefLength: number;
  elementsData = [];
  rawFields: any;
  label: string = "";
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
    // Then, continue on with other initialization
    this.menuIconOverride$ = this.utils.getImageSrc('trash', this.PCore$.getAssetLoader().getStaticServerUrl());
    // call checkAndUpdate when initializing
    this.checkAndUpdate();
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

    if (this.configProps$["visibility"] != null) {
      // eslint-disable-next-line no-multi-assign
      this.bVisible$ = this.bVisible$ = this.utils.getBooleanValue(this.configProps$["visibility"]);
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
    if (!contextClass){
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

    this.requestedReadOnlyMode = renderMode === "ReadOnly";
    this.readOnlyMode = renderMode === "ReadOnly";
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
    this.displayedColumns = this.fieldDefs?.map( (field) => {
      return field.name ? field.name : field.cellRenderer;
    });
  
    // And now we can process the resolvedFields to add in the "name"
    //  from from the fieldDefs. This "name" is the value that
    //  we'll share to connect things together in the table.

    this.processedFields = [];

    this.processedFields = resolvedFields.map((field, i) => {
      field.config["name"] = this.displayedColumns[i]; // .config["value"].replace(/ ./g,"_");   // replace space dot with underscore
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

  // Callback passed when subscribing to store change
  onStateChange() {
    this.checkAndUpdate();
  }

  // return the value that should be shown as the contents for the given row data
  //  of the given row field
  getRowValue(inRowData: Object, inColKey: string): any {
    // See what data (if any) we have to display
    const refKeys: Array<string> = inColKey.split(".");
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
        this.rowData = data;
      });
    } else {
      // The referenceList prop has the JSON data for each row to be displayed
      //  in the table. So, iterate over referenceList to create the dataRows that
      //  we're using as the table's dataSource
      const data = this.formatRowsData(referenceList);
      this.rowData = data;
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
  };

  deleteRecord(index) {
    if (this.PCore$.getPCoreVersion()?.includes('8.7')) {
      this.pConn$.getListActions().deleteEntry(index, this.pageReference);
    } else {
      this.pConn$.getListActions().deleteEntry(index);
    }
  };

  buildElementsForTable() {
    const context = this.pConn$.getContextName();
    const eleData: any = [];
    this.referenceList.forEach((element, index) => {
      const data: any = [];
      this.rawFields?.forEach(item => {
        const referenceListData = this.fieldGroupUtils.getReferenceList(this.pConn$);
        const isDatapage = referenceListData.startsWith('D_');
        const pageReferenceValue = isDatapage ? `${referenceListData}[${index}]` : `${this.pConn$.getPageReference()}${referenceListData.substring(referenceListData.lastIndexOf('.'))}[${index}]`;
        const config = {
          meta: item,
          options: {
            context,
            pageReference: pageReferenceValue,
            referenceList: referenceListData,
            hasForm: true
          }
        };
        const view = this.PCore$.createPConnect(config);
        data.push(view);
      });
      eleData.push(data);
    });
    this.elementsData = eleData;
  }
}
