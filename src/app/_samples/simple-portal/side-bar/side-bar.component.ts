import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { CaseService, DatapageService, ProgressSpinnerService, UpdateWorklistService } from '@pega/angular-sdk-components';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
  standalone: true,
  imports: [CommonModule, MatButtonModule]
})
export class SideBarComponent implements OnInit, OnDestroy {
  @Input() pConn$: typeof PConnect;

  arButtons$: any[] = [];
  arWorkItems$: any[] = [];
  worklistSubscription: Subscription;

  constructor(
    private psservice: ProgressSpinnerService,
    private uwservice: UpdateWorklistService,
    private dpservice: DatapageService,
    private cservice: CaseService
  ) {}

  ngOnInit(): void {
    this.worklistSubscription = this.uwservice.getMessage().subscribe(message => {
      if (message.update) {
        this.updateWorkList();
      }
    });

    this.updateCaseTypes();
    this.updateWorkList();
  }

  ngOnDestroy() {
    this.worklistSubscription.unsubscribe();
  }

  updateCaseTypes() {
    this.cservice.getCaseTypes().subscribe(
      (response: any) => {
        const caseManagement = response.body;
        const caseTypes = caseManagement.caseTypes;
        // const displayableCaseTypes = [];

        for (const myCase of caseTypes) {
          if (myCase.CanCreate == 'true') {
            const oPayload: any = {};
            oPayload.caseTypeID = myCase.ID;
            oPayload.processID = myCase.startingProcesses[0].ID;
            oPayload.caption = myCase.name;

            this.arButtons$.push(oPayload);
          }
        }
      },
      err => {
        alert(`Errors from get casetypes:${err.errors}`);
      }
    );
  }

  updateWorkList() {
    const worklistParams = new HttpParams().set('Work', 'true');

    const dsubscription = this.dpservice.getDataPage('D_Worklist', worklistParams).subscribe(
      (response: any) => {
        const datapageResults = response.body.pxResults;

        this.arWorkItems$ = [];

        for (const myWork of datapageResults) {
          const oPayload: any = {};
          oPayload.caption = `${myWork.pxRefObjectInsName} - ${myWork.pxTaskLabel}`;
          oPayload.pzInsKey = myWork.pzInsKey;
          oPayload.pxRefObjectClass = myWork.pxRefObjectClass;

          this.arWorkItems$.push(oPayload);
        }

        dsubscription.unsubscribe();
      },
      err => {
        alert(`Error form worklist:${err.errors}`);
      }
    );
  }

  buttonClick(oButtonData) {
    const actionsApi = this.pConn$.getActionsApi();
    const createWork = actionsApi.createWork.bind(actionsApi);
    const sFlowType = 'pyStartCase';

    const actionInfo: any = {
      containerName: 'primary',
      flowType: sFlowType || 'pyStartCase'
    };

    this.psservice.sendMessage(true);

    PCore.getPubSubUtils().publish('showWork');

    createWork(oButtonData.caseTypeID, actionInfo);
  }

  workButtonClick(oButtonData) {
    const actionsApi = this.pConn$.getActionsApi();
    const openAssignment: any = actionsApi.openAssignment.bind(actionsApi);

    // let sKey = oButtonData.pzInsKey
    const { pxRefObjectClass, pzInsKey } = oButtonData;
    const sTarget = this.pConn$.getContainerName();

    const options = { containerName: sTarget };

    this.psservice.sendMessage(true);

    PCore.getPubSubUtils().publish('showWork');

    openAssignment(pzInsKey, pxRefObjectClass, options).then(() => {});
  }
}
