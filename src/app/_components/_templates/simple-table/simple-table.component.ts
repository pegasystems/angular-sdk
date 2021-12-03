import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Utils } from "../../../_helpers/utils";
import { AngularPConnectService } from "../../../_bridge/angular-pconnect";
import { getContext, populateRowKey, buildFieldsForTable } from './helpers';


@Component({
  selector: 'app-simple-table',
  templateUrl: './simple-table.component.html',
  styleUrls: ['./simple-table.component.scss']
})
export class SimpleTableComponent implements OnInit {
  @Input() pConn$: any;
  @Input() formGroup$: FormGroup;

  configProps$ : any;

  displayedColumns: string[] = [];
  rowData: Array<any> = [];
  processedFields: Array<any> = [];
  requestedReadOnlyMode: boolean = false;
  readOnlyMode: boolean = false;

  // Used with AngularPConnect
  angularPConnectData: any = {};
  

  constructor( private angularPConnect: AngularPConnectService, 
               private utils: Utils ) {

   }

   ngOnInit(): void {

    // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);

    // Then, continue on with other initialization

    // call updateSelf when initializing
    this.updateSelf();

  }

  ngOnDestroy(): void {

    if (this.angularPConnectData.unsubscribeFn) {
      this.angularPConnectData.unsubscribeFn();
    }
  } 


  // updateSelf
  updateSelf(): void {
    // moved this from ngOnInit() and call this from there instead...
    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());

    // NOTE: getConfigProps() has each child.config with datasource and value undefined
    //  but getRawMetadata() has each child.config with datasource and value showing their unresolved values (ex: "@P thePropName")
    //  We need to use the prop name as the "glue" to tie the Angular Material table dataSource, displayColumns and data together.
    //  So, in the code below, we'll use the unresolved config.value (but replacing the space with an underscore to keep things happy)
    const rawMetadata = this.pConn$.getRawMetadata();
    
    // Adapted from Nebula
    const { 
      label, 
      showLabel, 
      referenceList = [],     // if referenceList not in configProps$, default to empy list 
      renderMode, 
      children: [ {children: resolvedFields} ] // destructure children into an array var: "resolvedFields"
    } = this.configProps$;

    // get raw config as @P and other annotations are processed and don't appear in the resolved config.
    //  Destructure "raw" children into array var: "rawFields"
    //  NOTE: when config.listType == "associated", the property can be found in either
    //    config.value (ex: "@P .DeclarantChoice") or
    //    config.datasource (ex: "@ASSOCIATED .DeclarantChoice")
    //  Neither of these appear in the resolved (this.configProps$)
    const {
      children: [{ children: rawFields }]
    } = rawMetadata.config;

    // At this point, fields has resolvedFields and rawFields we can use

    // console.log("SimpleTable resolvedFields:");
    // console.log( resolvedFields );
    // console.log("SimpleTable rawFields:");
    // console.log( rawFields );

    // start of from Nebula
    // get context name and referenceList which will be used to prepare config of PConnect
    const { contextName, referenceListStr, pageReferenceForRows } = getContext(
      this.pConn$
    );

    // This gives up the "properties" we need to map to row/column values later
    // const processedData = populateRowKey(referenceList);

    this.requestedReadOnlyMode = (renderMode === "ReadOnly");
    this.readOnlyMode = renderMode === "ReadOnly";
  

    // TEMPORARILY show all tables as read only
    if (!this.readOnlyMode) {
      console.warn(`SimpleTable: currently not editable. Displaying requested editable table as READ ONLY!`);
      this.readOnlyMode = true;
    }


    // Nebula has other handling for isReadOnlyMode but has Cosmos-specific code
    //  so ignoring that for now...
    // fieldDefs will be an array where each entry will have a "name" which will be the
    //  "resolved" property name (that we can use as the colId) though it's not really
    //  resolved. The buildFieldsForTable helper just removes the "@P " (which is what
    //  Nebula does). It will also have the "label", and "meta" contains the original,
    //  unchanged config info. For now, much of the info here is carried over from
    //  Nebula and we may not end up using it all.
    const fieldDefs = buildFieldsForTable(rawFields, resolvedFields, this.readOnlyMode);

    // end of from Nebula

    // Here, we use the "name" field in fieldDefs since that has the assoicated property
    //  (if one exists for the field). If no "name", use "cellRenderer" (typically get DELETE_ICON)
    //  for our columns.
    this.displayedColumns = fieldDefs.map( (field) => {
      return field.name ? field.name : field.cellRenderer;
    });

    // console.log(`SimpleTable displayedColumns:`);
    // console.log(this.displayedColumns);

    // And now we can process the resolvedFields to add in the "name" 
    //  from from the fieldDefs. This "name" is the value that
    //  we'll share to connect things together in the table.

    this.processedFields = [];

    this.processedFields = resolvedFields.map( (field, i) => {
      field.config["name"] = this.displayedColumns[i];  // .config["value"].replace(/ ./g,"_");   // replace space dot with underscore
      return field;
    })

    // console.log("SimpleTable processedFields:");
    // console.log(this.processedFields);


    // The referenceList prop has the JSON data for each row to be displayed
    //  in the table. So, iterate over referenceList to create the dataRows that
    //  we're using as the table's dataSource

    // re-initialize rowData each time we re-build it
    this.rowData = [];

    for (var row of referenceList) {
      let dataForRow: Object = {};

      for ( var col of this.displayedColumns ) {
        const colKey: string = col;

        const theProcessedField = this.getFieldFromFieldArray(colKey, this.processedFields);

        const theVal = this.getRowValue(row, colKey, theProcessedField);
        
        dataForRow[colKey] = theVal;
      }

      this.rowData.push(dataForRow);
    }

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

    // console.log("SimpleTable displayedColumns:");
    // console.log(this.displayedColumns);
    // console.log("SimpleTable processedFields:");
    // console.log(this.processedFields);
    // console.log("SimpleTable rowData:");
    // console.log(this.rowData);

  }

  // Callback passed when subscribing to store change
  onStateChange() {
    // Should always check the bridge to see if the component should
    // update itself (re-render)
    const bUpdateSelf = this.angularPConnect.shouldComponentUpdate( this );
  
    // ONLY call updateSelf when the component should update
    if (bUpdateSelf) {
      this.updateSelf();
    }
  }

  // return the value that should be shown as the contents for the given row data
  //  of the given row field
  getRowValue( inRowData: Object, inColKey: string, inRowField: any  ): any {

    // See what data (if any) we have to display
    const refKeys: Array<string> = inColKey.split('.');
    let valBuilder = inRowData;
    for ( var key of refKeys) {
      valBuilder = valBuilder[key];
    }    

    if (this.requestedReadOnlyMode || inRowField?.config?.readOnly) {
      // Show the requested data as a readOnly entry in the table.
      return valBuilder;
    } else { 
      const thePlaceholder = inRowField?.config?.placeholder ? inRowField.config.placeholder : "";
      const theEditComponent = inRowField.type ? inRowField.type : "not specified";
      // For, display (readonly), the initial value (if there is one - otherwise, try placeholder)
      //  and which component should be used for editing
      return `${ (valBuilder !== "") ? valBuilder: thePlaceholder} (edit with ${theEditComponent})`;
    }
  }
  // return the field from the incoming fields array that has "name" of
  //  requested field
  getFieldFromFieldArray ( inFieldName: string, inFieldArray: Array<any>) : Object {
    let objRet = {};

    for (var field of inFieldArray) {
      if ( field?.config?.name === inFieldName) {
        objRet = field;
        break;
      }
    }

    return objRet;
  }

}
