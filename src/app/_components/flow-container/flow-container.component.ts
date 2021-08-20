import { Component, OnInit, Input } from '@angular/core';
import { ChangeDetectorRef } from "@angular/core";
import { ProgressSpinnerService } from "../../_messages/progress-spinner.service";
import { ErrorMessagesService } from "../../_messages/error-messages.service";
import { ResetPConnectService } from "../../_messages/reset-pconnect.service";
import { interval } from "rxjs/internal/observable/interval";
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AngularPConnectService } from "../../_bridge/angular-pconnect";
import { Utils } from "../../_helpers/utils";
import { NgZone } from '@angular/core';

//
// WARNING:  It is not expected that this file should be modified.  It is part of infrastructure code that works with 
// Redux and creation/update of Redux containers and PConnect.  Modifying this code could have undesireable results and
// is totally at your own risk.
//

@Component({
  selector: 'app-flow-container',
  templateUrl: './flow-container.component.html',
  styleUrls: ['./flow-container.component.scss'],
  providers: [Utils]
})
export class FlowContainerComponent implements OnInit {

  @Input() pConn$: any;

  configProps$ : Object;
  arChildren$: Array<any>;

  itemKey$: string = ""; 

  containerName$: string;
  workID$: string;
  currentCaseID$: string;
  buildName$: string;

  templateName$: string;

  formGroup$: FormGroup;

  arMainButtons$: Array<any>;
  arSecondaryButtons$: Array<any>;

  mainButtonFn$ : string;
  secondaryButtonFn$ : string;

  

  //bHasNavigation$: boolean = false;

  svgCurrent$: string;
  svgNotCurrent$: string;

  //todo
  todo_showTodo$: boolean = false;
  todo_caseInfoID$: string;
  todo_showTodoList$: boolean = false;
  todo_datasource$: any;
  todo_headerText$: string = "To do";
  todo_type$ : string;
  todo_context$: string;
  todo_pConn$: any;

  bHasCancel = false;

  // messages
  caseMessages$: string;
  bHasCaseMessages$: boolean = false;
  checkSvg$: string;

  state: any;
  //itemKey: string = "";   // JA - this is what Nebula/Constellation uses to pass to finishAssignment, navigateToStep

  PCore$: any;

  // For interaction with AngularPConnect
  angularPConnectData: any = {};  

  constructor(private angularPConnect: AngularPConnectService, 
              private cdRef: ChangeDetectorRef,
              private psService: ProgressSpinnerService,
              private erService: ErrorMessagesService,
              private rpcService: ResetPConnectService,
              private fb: FormBuilder,
              private ngZone: NgZone,
              private utils: Utils) { 


  
    // create the formGroup
    this.formGroup$ = fb.group({ hideRequired: false});


  
  }


  

  ngOnInit() {
    // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);

    if (!this.PCore$) {
      this.PCore$ = window.PCore;
    }

    // Then, continue on with other initialization


    //with init, force children to be loaded of global pConn
    this.initComponent(true);

    this.initContainer();
  
    this.PCore$.getPubSubUtils().subscribe(
      this.PCore$.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL,
      () => { this.handleCancel() },
      "cancelAssignment"
    );

    this.PCore$.getPubSubUtils().subscribe(
      "cancelPressed",
      () => { this.handleCancelPressed() },
      "cancelPressed"
    );
  
  }

  ngOnDestroy() {
    if (this.angularPConnectData.unsubscribeFn) {
      this.angularPConnectData.unsubscribeFn();
    }

    this.PCore$.getPubSubUtils().unsubscribe(
      this.PCore$.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL,
      "cancelAssignment"
    );

    this.PCore$.getPubSubUtils().unsubscribe(
      "cancelPressed",
      "cancelPressed"
    );

  }

  ngOnChanges(data: any) {

  }

  handleCancel() {
    // cancel happened, so ok to initialize the flow container
    sessionStorage.setItem("okToInitFlowContainer", "true");

  }

  handleCancelPressed() {
    this.bHasCancel = true;
  }



  // Callback passed when subscribing to store change
  onStateChange() {

    // Should always check the bridge to see if the component should update itself (re-render)
    const bUpdateSelf = this.angularPConnect.shouldComponentUpdate( this );

    // ONLY call updateSelf when the component should update
    //    AND removing the "gate" that was put there since shouldComponentUpdate
    //      should be the real "gate"
    if (bUpdateSelf) {

      // don't want to redraw the flow container when there are page messages, because
      // the redraw causes us to loose the errors on the elements
      const completeProps = this.angularPConnect.getCurrentCompleteProps(this);
      if (!completeProps["pageMessages"] || completeProps["pageMessages"].length == 0) {



        // with a cancel, need to timeout so todo will update correctly
        if (this.bHasCancel) {
          this.bHasCancel = false;
          setTimeout(() => {
            this.updateSelf();
          }, 500);
        }
        else {
            this.updateSelf();
        }

      }

      
    }



  }

  getTodoVisibilty() {
    const caseViewMode = this.pConn$.getValue("context_data.caseViewMode");
    if (caseViewMode && caseViewMode === "review") {

      let kid = this.pConn$.getChildren()[0];
      let todoKid = kid.getPConnect().getChildren()[0];

      this.todo_pConn$ = todoKid.getPConnect();

      return true;
    }
    if (caseViewMode && caseViewMode === "perform") {
      return false;
    }

    return true;
  }

  initContainer() {
    let containerMgr = this.pConn$.getContainerManager();
    let baseContext = this.pConn$.getContextName();
    const containerName = this.pConn$.getContainerName();
    const containerType = "single";

    const flowContainerTarget = `${baseContext}/${containerName}`;
    const isContainerItemAvailable = this.PCore$.getContainerUtils().getActiveContainerItemName(
      flowContainerTarget
    );

    // clear out since we are initializing
    sessionStorage.setItem("okToInitFlowContainer", "false");

    if (!isContainerItemAvailable) {
      containerMgr.initializeContainers({
        type: containerType
      });

      containerMgr.addContainerItem({
        semanticURL: "",
        key: this.pConn$.getValue("key"),
        flowName: this.pConn$.getValue("flowName"),
        caseViewMode: "perform",
        data: this.pConn$.getDataObject(baseContext),
        containerType
      });
    }
  }

  initComponent( bLoadChildren: boolean) {

    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());

    // when true, update arChildren from pConn, otherwise, arChilren will be updated in updateSelf()
    if (bLoadChildren) {
      this.arChildren$ = this.pConn$.getChildren();
    }
   

    let oData = this.pConn$.getDataObject();

    let activeActionLabel: string = "";
    let { getPConnect } = this.arChildren$[0].getPConnect();



    this.todo_showTodo$ = this.getTodoVisibilty();
    
    // create pointers to functions
    let containerMgr = this.pConn$.getContainerManager();
    let actionsAPI = this.pConn$.getActionsApi();
    let baseContext = this.pConn$.getContextName();
    let acName = this.pConn$.getContainerName();

    this.pConn$.isBoundToState();

    // inside
    // get fist kid, get the name and displa
    // pass first kid to a view container, which will disperse it to a view which will use one column, two column, etc.
    let oWorkItem = this.arChildren$[0].getPConnect();
    let oWorkMeta = oWorkItem.getRawMetadata();
    let oWorkData = oWorkItem.getDataObject();

    //this.containerName$ = oWorkMeta["name"];
    if (bLoadChildren && oWorkData) { 
      this.containerName$ = this.getActiveViewLabel() || oWorkData.caseInfo.assignments[0].name;
    }


    // turn off spinner
    this.psService.sendMessage(false);
  

  }

  hasAssignments() {

    let hasAssignments = false;
    const assignmentsList = this.pConn$.getValue("caseInfo.assignments");

    const hasChildCaseAssignments = this.hasChildCaseAssignments();

    if (
      assignmentsList ||
      hasChildCaseAssignments ||
      this.isCaseWideLocalAction()
    ) {
      hasAssignments = true;
    }

    return hasAssignments;
  }

  isCaseWideLocalAction() {
    const actionID = this.pConn$.getValue("caseInfo.activeActionID");
    const caseActions = this.pConn$.getValue("caseInfo.availableActions");
    let bCaseWideAction = false;
    if (caseActions && actionID) {
      const actionObj = caseActions.find(
        (caseAction) => caseAction.ID === actionID
      );
      if (actionObj) {
        bCaseWideAction = actionObj.type === "Case";
      }
    }
    return bCaseWideAction;
  }

  hasChildCaseAssignments() {

    const childCases = this.pConn$.getValue("caseInfo.childCases");
    let allAssignments = [];
    if (childCases && childCases.length > 0) {
      return true;
    }
    return false;
  }

  getActiveViewLabel() {
    let activeActionLabel = "";


    const { CASE_INFO: CASE_CONSTS, CONTAINER_TYPE } = this.PCore$.getConstants();

    const caseActions = this.pConn$.getValue(CASE_CONSTS.CASE_INFO_ACTIONS);
    const activeActionID = this.pConn$.getValue(CASE_CONSTS.ACTIVE_ACTION_ID);
    const activeAction = caseActions.find(
      (action) => action.ID === activeActionID
    );
    if (activeAction) {
      activeActionLabel = activeAction.name;
    }
    return activeActionLabel;
  }



  findCurrentIndicies(arStepperSteps: Array<any>, arIndicies: Array<number>, depth: number) : Array<number> {

    let count = 0;
    arStepperSteps.forEach( (step) => {
      if (step.visited_status == "current") {
        arIndicies[depth] = count;

        // add in
        step["step_status"] = "";
      }
      else if (step.visited_status == "success") {
        count++
        step.step_status = "completed"
      }
      else {
        count++;
        step.step_status = "";
      }

      if (step.steps) {
        arIndicies = this.findCurrentIndicies(step.steps, arIndicies, depth + 1)
      }
    });

    return arIndicies;
  }

  // Called when bridge shouldComponentUpdate indicates that this component
  //  should update itself (re-render)
  updateSelf() {
     
     // for now
     let { getPConnect } = this.arChildren$[0].getPConnect();
     let localPConn = this.arChildren$[0].getPConnect();

     // routingInfo was added as component prop in populateAdditionalProps
     let routingInfo = this.angularPConnect.getComponentProp(this, "routingInfo");

     let loadingInfo: any;
     try {
      loadingInfo = this.pConn$.getLoadingStatus();
     } 
     catch (ex) {

     }
     
     const caseViewMode = this.pConn$.getValue("context_data.caseViewMode");
     const { CASE_INFO: CASE_CONSTS, CONTAINER_TYPE } = this.PCore$.getConstants();

     if (caseViewMode && caseViewMode == "review") {

      setTimeout(() => {

        this.ngZone.run(() => {
          const assignmentsList = localPConn.getValue(
            CASE_CONSTS.D_CASE_ASSIGNMENTS_RESULTS
          );
     
          const caseActions = localPConn.getValue(CASE_CONSTS.CASE_INFO_ACTIONS);
          
          if (caseActions) {
            this.todo_caseInfoID$ = localPConn.getValue(CASE_CONSTS.CASE_INFO_ID);
            this.todo_datasource$ = { source: assignmentsList };
          }

          let kid = this.pConn$.getChildren()[0];
          let todoKid = kid.getPConnect().getChildren()[0];

          this.todo_pConn$ = todoKid.getPConnect();
    
          this.todo_showTodo$ = true;

          this.psService.sendMessage(false);
        });


      });

      // in Nebula/Constellation, when cancel is called, somehow the constructor for flowContainer is called which
      // does init/add of containers.  This mimics that
      if (sessionStorage.getItem("okToInitFlowContainer") == "true") {
        this.initContainer();
      }

     }
     else if (caseViewMode && caseViewMode == "perform") {
       // perform
       this.todo_showTodo$ = false;

        // this is different than Angular SDK, as we need to initContainer if root container reloaded
        if (sessionStorage.getItem("okToInitFlowContainer") == "true") {
          this.initContainer();
        }
     }


     // if have caseMessage show message and end
     this.caseMessages$ = this.pConn$.getValue("caseMessages");
     if (this.caseMessages$ || !this.hasAssignments()) {
       this.bHasCaseMessages$ = true;
       this.checkSvg$  = this.utils.getImageSrc("check", this.PCore$.getAssetLoader().getStaticServerUrl());

        // publish this "assignmentFinished" for mashup, need to get approved as a standard
        this.PCore$.getPubSubUtils().publish(
          "assignmentFinished");

        this.psService.sendMessage(false);

        return;
    }
    else if (this.bHasCaseMessages$) {

        this.bHasCaseMessages$ = false;
    }


     // this check in routingInfo, mimic Nebula/Constellation (React) to check and get the internals of the 
     // flowContainer and force updates to pConnect/redux
     if (routingInfo && loadingInfo != undefined) {

        let currentOrder = routingInfo.accessedOrder;
        let currentItems = routingInfo.items;
        let type = routingInfo.type;
        if (currentOrder && currentItems) {       // JA - making more similar to Nebula/Constellation
          let key = currentOrder[currentOrder.length - 1];

          // save off itemKey to be used for finishAssignment, etc.
          // timeout and detectChanges to avoid ExpressionChangedAfterItHasBeenCheckedError
          setTimeout(() => {
            if (key && key != "") {
              this.itemKey$ = key; 
              this.cdRef.detectChanges();
            }
          });


          if (currentOrder.length > 0) {
  
            if (currentItems[key] &&
                currentItems[key].view &&
                type === "single" &&
                Object.keys(currentItems[key].view).length > 0 ) {

                  // when we get here, it it because the flow action data has changed
                  // from the server, and need to add to pConnect and update children

                  let currentItem = currentItems[key];
                  let rootView = currentItem.view;
                  let { context } = rootView.config;
                  let config = { meta: rootView };
  
                  config["options"] = {
                    context: currentItem.context,
                    pageReference: context || localPConn.getPageReference(),
                    hasForm: true,
                    isFlowContainer: true,
                    containerName: localPConn.getContainerName(),
                    containerItemName: key,
                    parentPageReference: localPConn.getPageReference()
                  };
  
                  // add more data to pConnect
                  let configObject = this.PCore$.createPConnect(config);

                  

                  // makes sure Angular tracks these changes
                  this.ngZone.run(() => {

                    this.buildName$ = this.getBuildName();
                    // what comes back now in configObject is the children of the flowContainer

                    this.arChildren$ = new Array();
                    this.arChildren$.push(configObject);

                    this.psService.sendMessage(false);

                    let oWorkItem = this.arChildren$[0].getPConnect();
                    let oWorkData = oWorkItem.getDataObject();

                    this.containerName$ = this.getActiveViewLabel() || oWorkData.caseInfo.assignments[0].name;
                  });
  
                
            }
          }
        }

     }

  }
 

  getBuildName(): string {
  
    // let { getPConnect, name } = this.pConn$.props;
    let context = this.pConn$.getContextName();
    let viewContainerName = this.pConn$.getContainerName();

    if (!viewContainerName) viewContainerName = "";
    return `${context.toUpperCase()}/${viewContainerName.toUpperCase()}`;
  }



  formValid(): boolean {

    this.touchAll();
    return this.formGroup$.valid;

  }

  touchAll(): void {
    Object.values(this.formGroup$.controls).forEach(
      control => {
          control.markAsTouched();
      }
    )   
  }


  topViewRefresh(): void {


    Object.values(this.formGroup$.controls).forEach(
      control => {
        control.markAsTouched();

      }
    )

  }
  

}