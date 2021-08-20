import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AngularPConnectService } from "../../_bridge/angular-pconnect";
import { ProgressSpinnerService } from "../../_messages/progress-spinner.service";
import { Utils } from "../../_helpers/utils";

// import * as moment from "moment";


@Component({
  selector: 'app-repeating-structures',
  templateUrl: './repeating-structures.component.html',
  styleUrls: ['./repeating-structures.component.scss']
})
export class RepeatingStructuresComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() pConn$: any;
  repeatList$: MatTableDataSource<any>;
  fields$ : Array<any>;
  displayedColumns$ = Array<string>();
  configProps: any;

  constructor(private psService: ProgressSpinnerService, 
    private utils: Utils) { 

  }

  ngOnInit(): void {
    const componentConfig = this.pConn$.getRawMetadata().config || { fields: []};
    this.configProps = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());
    this.fields$ = this.initializeColumns(componentConfig.fields);

    const refList = this.configProps.referenceList;
    const tableDataResults = JSON.parse(
      JSON.stringify(this.pConn$.getValue(refList))
    );

    // update elements like date format
    let updatedRefList = this.updateData(tableDataResults, this.fields$);

    this.repeatList$ = new MatTableDataSource(updatedRefList);
    this.displayedColumns$ = this.getDisplayColums(this.fields$);
    this.repeatList$.paginator = this.paginator;
  }

  ngOnDestroy() {

  }

  ngAfterViewInit() {
    // paginator has to exist for this to work,
    // so called after init (paginator drawn)
    this.repeatList$.paginator = this.paginator;
    this.repeatList$.sort = this.sort;
  }

  applySearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.repeatList$.filter = filterValue.trim().toLowerCase();

    if (this.repeatList$.paginator) {
      this.repeatList$.paginator.firstPage();
    }
  }

  rowClick(row) {
    switch (this.configProps.rowClickAction) {
      case "openAssignment" :
        this.psService.sendMessage(true);
        this.openAssignment(row);
        break;
    }
  }

  updateData( listData:Array<any>, fieldData:Array<any>): Array<any> {
    let returnList : Array<any> = new Array<any>();
    for ( let row in listData) {
       // copy
      let rowData = JSON.parse(JSON.stringify(listData[row]));

      for (let field in fieldData) {
        if (fieldData[field].type == "date") {
          let fieldName = fieldData[field].name;
          let formattedDate = rowData[fieldName];

          // format date
          // formattedDate = formattedDate.replace("GMT", "+0000");
          // formattedDate = moment(formattedDate, "YYYYMMDD[T]HHmmss[.]SSS Z").format("MMMM D, YYYY h:mm:ss A");
          this.utils.generateDateTime(formattedDate, "MMMM D, YYYY h:mm:ss A");

          // update
          rowData[fieldName] = formattedDate;
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
    this.pConn$.getActionsApi().openAssignment(pzInsKey, pxRefObjectClass, options).then(() => {});
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
    return fields.map(( field, colIndex) => (field.name));
  }
}
