import { Component, OnInit, Input } from '@angular/core';
import { ProgressSpinnerService } from "../../../_messages/progress-spinner.service";
import { GetLoginStatusService } from "../../../_messages/get-login-status.service";
import { CaseService } from "../../../_services/case.service";
import { UpdateWorklistService } from "../../../_messages/update-worklist.service";
import { DatapageService } from "../../../_services/datapage.service";
import { Subscription } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Data } from '@angular/router';


declare function loadMashup(targetDom: any, preLoadComponents: any): any;

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  @Input() pConn$: any;
  
  arButtons$: Array<any> = new Array();
  arWorkItems$: Array<any> = new Array();
  

  oConfig: object;

  worklistSubscription: Subscription;


  constructor(private psservice: ProgressSpinnerService,
              private glsservice: GetLoginStatusService,
              private uwservice: UpdateWorklistService,
              private dpservice: DatapageService,
              private cservice: CaseService) { }

  ngOnInit(): void {

    this.worklistSubscription = this.uwservice.getMessage().subscribe(
      message => {
        if (message.update) {
          this.updateWorkList();
        }
      }
    );

    this.updateCaseTypes();
    this.updateWorkList();

 


  }

  ngOnDestroy() {
    this.worklistSubscription.unsubscribe();
  }

  updateCaseTypes() {

    this.cservice.getCaseTypes().subscribe(
      response => {

        let caseManagement = response.body;
        let caseTypes = caseManagement["caseTypes"];
        let displayableCaseTypes  = new Array();


        for (let myCase of caseTypes) {
          if (myCase.CanCreate == "true") {
            let oPayload = {};
            oPayload["caseTypeID"] = myCase.ID;
            oPayload["processID"] = myCase.startingProcesses[0].ID;
            oPayload["caption"] = myCase.name;

            this.arButtons$.push(oPayload);

          }
        }

      },
      err => {
        alert("Errors from get casetypes:" + err.errors);
        this.glsservice.sendMessage("LoggedOff");
      }
    );
  }

  updateWorkList() {
    let worklistParams = new HttpParams().set('Work', 'true');



    let dsubscription = this.dpservice.getDataPage("D_Worklist", worklistParams).subscribe(

      response => {
        let datapageResults = response.body["pxResults"];

        this.arWorkItems$ = new Array();

        for (let myWork of datapageResults) {
          let oPayload = {};
          oPayload["caption"] = myWork.pxRefObjectInsName + " - " + myWork.pxTaskLabel;
          oPayload["pzInsKey"] = myWork.pzInsKey;
          oPayload["pxRefObjectClass"] = myWork.pxRefObjectClass;

          this.arWorkItems$.push(oPayload);
        }


        dsubscription.unsubscribe();
        
      },
      err => {
        alert("Error form worklist:" + err.errors);
      }
    );


  }



  buttonClick(oButtonData) {

    let actionsApi = this.pConn$.getActionsApi();
    let createWork = actionsApi.createWork.bind(actionsApi);
    let sFlowType = "pyStartCase";

    const actionInfo = {
      containerName: "primary",
      flowType: sFlowType ? sFlowType : "pyStartCase"
    };

    this.psservice.sendMessage(true);

    window.PCore.getPubSubUtils().publish(
      "showWork");

    createWork(oButtonData.caseTypeID, actionInfo);




  }


  workButtonClick(oButtonData) {
    let actionsApi = this.pConn$.getActionsApi();
    let openAssignment = actionsApi.openAssignment.bind(actionsApi);


    //let sKey = oButtonData.pzInsKey
    const { pxRefObjectClass, pzInsKey } = oButtonData;
    let sTarget = this.pConn$.getContainerName();


    let options = { "containerName" : sTarget};

    this.psservice.sendMessage(true);

    window.PCore.getPubSubUtils().publish(
      "showWork");

    openAssignment(pzInsKey, pxRefObjectClass, options).then(() => {});


  }

}
