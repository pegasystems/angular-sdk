import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ChangeDetectorRef } from "@angular/core";
import { Subscription, Observable } from 'rxjs';
import { Utils } from "../../../_helpers/utils";
import { AngularPConnectService } from "../../../_bridge/angular-pconnect";
import { interval } from "rxjs/internal/observable/interval";



@Component({
  selector: 'app-case-view',
  templateUrl: './case-view.component.html',
  styleUrls: ['./case-view.component.scss'],
  providers: [Utils]
})
export class CaseViewComponent implements OnInit {


  @Input() pConn$: any;
  @Input() formGroup$: FormGroup;
  @Input() displayOnlyFA$: boolean;

  configProps$ : Object;
  arChildren$: Array<any>;



  heading$: string = "";
  caseClass$: string = "";
  id$: string = "";
  status$: string = "";  
  caseTabs$: Array<any>;
  svgCase$: string;
  tabData$: any;

  mainTabs: any;
  mainTabData : any;

  // Used with AngularPConnect
  angularPConnectData: any = {};

  arAvailableActions$: Array<any> = [];
  arAvailabeProcesses$: Array<any> = [];

  PCore$: any;

  caseSummaryPConn$: any;
  currentCaseID: string = "";


  constructor(private cdRef: ChangeDetectorRef,
              private angularPConnect: AngularPConnectService,
              private utils: Utils) { }

  ngOnInit(): void {

    if (!this.PCore$) {
      this.PCore$ = window.PCore;
    }

    // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);

    this.updateSelf();





  }

  ngOnDestroy(): void {
    if (this.angularPConnectData.unsubscribeFn) {
      this.angularPConnectData.unsubscribeFn();
    }
  }


  // Callback passed when subscribing to store change
  onStateChange() {
    const bLogging = false;

    // Should always check the bridge to see if the component should update itself (re-render)
    const bUpdateSelf = this.angularPConnect.shouldComponentUpdate( this );

    // ONLY call updateSelf when the component should update
    //    AND removing the "gate" that was put there since shouldComponentUpdate
    //      should be the real "gate"
    if (bUpdateSelf) {

      // generally, don't want to refresh everything when data changes in caseView, it is usually the 
      // case summary.  But check if the case ID changes, this means a different case and we should
      // update all.
      if (this.hasCaseIDChanged()) {
        this.fullUpdate();

        // update okToInitFlowContainer, because case view was drawn, flow container will need to be init
        // to match Nebula/Constellation
        sessionStorage.setItem("okToInitFlowContainer", "true");
      }
      else {
        this.updateHeaderAndSummary();
      }

 
    }



  }

  hasCaseIDChanged() : boolean {

    if (this.currentCaseID !== this.pConn$.getDataObject().caseInfo.ID) {
      this.currentCaseID = this.pConn$.getDataObject().caseInfo.ID
      return true;
    }
    else {
      return false;
    }
  }

  updateHeaderAndSummary() {
    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());

    let kids = this.pConn$.getChildren();
    for (let kid of kids) {
      let meta = kid.getPConnect().getRawMetadata();
      if (meta.type.toLowerCase() == 'region' && meta.name.toLowerCase() == 'summary') {
        this.caseSummaryPConn$ = kid.getPConnect().getChildren()[0].getPConnect();
      }
    }



    // have to put in a timeout, otherwise get an angular change event error
    let timer = interval(100).subscribe(() => {
      timer.unsubscribe();

      this.heading$ = this.configProps$["header"];
      this.id$ = this.configProps$["subheader"];
      this.status$ = this.pConn$.getValue(".pyStatusWork");
      });
  }



  fullUpdate() {
    this.updateHeaderAndSummary();

    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());
    this.arChildren$ = this.pConn$.getChildren();

    let caseInfo = this.pConn$.getDataObject().caseInfo;
    this.currentCaseID = caseInfo.ID;
    this.arAvailableActions$ = caseInfo?.availableActions ? caseInfo.availableActions: [];
    this.arAvailabeProcesses$ = caseInfo?.availableProcesses ? caseInfo.availableProcesses : [];


    this.svgCase$ = this.utils.getImageSrc(this.configProps$["icon"], this.PCore$.getAssetLoader().getStaticServerUrl());

    //this.utils.consoleKidDump(this.pConn$);
    
    if (!this.displayOnlyFA$) {
      for (let kid of this.arChildren$) {
        let kidPConn = kid.getPConnect();
        if (kidPConn.getRawMetadata().name == "Tabs") {
          this.mainTabs = kid;
          this.mainTabData = this.mainTabs.getPConnect().getChildren();
          
          // default
          this.tabData$ = this.mainTabData[0].getPConnect().getRawMetadata();
        }
      }
  
  
  
      this.caseTabs$  = this.mainTabs
      .getPConnect()
      .getChildren()
      .map((child, i) => {
        const config = child.getPConnect().getRawMetadata().config;
        return { name: config.label || "No label specified in config", id: i };
      });
    }

  }

  updateSelf() {

    this.fullUpdate();

  }


  onTabClick(tab: any) {

    this.tabData$ = this.mainTabData[tab].getPConnect().getRawMetadata();
    this.cdRef.detectChanges();
  }



  _editClick() {


    const editAction = this.arAvailableActions$.find(
      (action) => action.ID === "pyUpdateCaseDetails"
    );
    const actionsAPI = this.pConn$.getActionsApi();
    const openLocalAction = actionsAPI.openLocalAction.bind(actionsAPI);

    openLocalAction( editAction.ID, { ...editAction});

  }


  _menuActionClick(data) {

    const actionsAPI = this.pConn$.getActionsApi();
    const openLocalAction = actionsAPI.openLocalAction.bind(actionsAPI);

    openLocalAction( data.ID, { ...data});
  }

  _menuProcessClick(data) {

    const actionsAPI = this.pConn$.getActionsApi();
    const openProcessAction = actionsAPI.openProcessAction.bind(actionsAPI);

    openProcessAction( data.ID, { ...data});

  }

}
