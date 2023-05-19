import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Utils } from '../../../_helpers/utils';

@Component({
  selector: 'app-case-history',
  templateUrl: './case-history.component.html',
  styleUrls: ['./case-history.component.scss'],
})
export class CaseHistoryComponent implements OnInit {
  @Input() pConn$: any;

  PCore$: any;
  configProps$: any;

  repeatList$: MatTableDataSource<any>;
  fields$: Array<any>;
  displayedColumns$ = Array<any>();
  waitingForData: boolean = false;

  constructor(private utils: Utils) {}

  ngOnInit(): void {
    if (!this.PCore$) {
      this.PCore$ = window.PCore;
    }

    this.configProps$ = this.pConn$.getConfigProps();

    const caseID = this.pConn$.getValue(this.PCore$.getConstants().CASE_INFO.CASE_INFO_ID);
    const dataViewName = 'D_pyWorkHistory';
    const context = this.pConn$.getContextName();

    this.waitingForData = true;

    const caseHistoryData = this.PCore$.getDataApiUtils().getData(dataViewName, `{"dataViewParameters":[{"CaseInstanceKey":"${caseID}"}]}`, context);

    caseHistoryData.then((historyJSON: Object) => {
      this.fields$ = [
        { label: 'Date', type: 'DateTime', fieldName: 'pxTimeCreated' },
        { label: 'Description', type: 'TextInput', fieldName: 'pyMessageKey' },
        { label: 'User', type: 'TextInput', fieldName: 'pyPerformer' },
      ];

      const tableDataResults = this.updateData(historyJSON['data'].data, this.fields$);

      this.displayedColumns$ = this.getDisplayColums(this.fields$);

      this.repeatList$ = new MatTableDataSource(tableDataResults);

      this.waitingForData = false;
    });
  }

  ngOnDestroy() {}

  updateFields(arFields, arColumns): Array<any> {
    let arReturn = arFields;
    for (let i in arReturn) {
      arReturn[i].config.name = arColumns[i];
    }

    return arReturn;
  }

  updateData(listData: Array<any>, fieldData: Array<any>): Array<any> {
    let returnList: Array<any> = new Array<any>();
    for (let row in listData) {
      // copy
      let rowData = JSON.parse(JSON.stringify(listData[row]));

      for (let field of fieldData) {
        let fieldName = field['fieldName'];
        let formattedDate;

        switch (field['type']) {
          case 'Date':
            formattedDate = this.utils.generateDate(rowData[fieldName], 'Date-Short-YYYY');
            rowData[fieldName] = formattedDate;
            break;
          case 'DateTime':
            formattedDate = this.utils.generateDateTime(rowData[fieldName], 'DateTime-Short-YYYY');
            rowData[fieldName] = formattedDate;
            break;
        }
      }

      returnList.push(rowData);
    }

    return returnList;
  }

  getDisplayColums(fields = []) {
    let arReturn = fields.map((field, colIndex) => {
      let theField = field.fieldName;

      return theField;
    });
    return arReturn;
  }
}
