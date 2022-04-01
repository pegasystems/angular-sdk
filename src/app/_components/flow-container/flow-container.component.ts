import { Component, OnInit, Input } from '@angular/core';
import { ChangeDetectorRef } from "@angular/core";
import { ProgressSpinnerService } from "../../_messages/progress-spinner.service";
import { ErrorMessagesService } from "../../_messages/error-messages.service";
import { ResetPConnectService } from "../../_messages/reset-pconnect.service";
import { ReferenceComponent } from "../reference/reference.component";
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
  instructionText$: string;
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
  pCoreConstants;

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

    // get the PCore constants
    this.pCoreConstants = this.PCore$.getConstants();


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
    this.checkAndUpdate();
  }

  checkAndUpdate() {
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

/* remove commented out code when update React/WC
*** instead of getting values here to pass to addContainerItem, we call the function below "addContainerItem"
*** which comes from flow container helpers in Nebula
*/
      // containerMgr.addContainerItem({
      //   semanticURL: "",
      //   key: this.pConn$.getValue("key"),
      //   flowName: this.pConn$.getValue("flowName"),
      //   caseViewMode: "perform",
      //   data: this.pConn$.getDataObject(baseContext),
      //   containerType
      // });

      this.addContainerItem(this.pConn$);
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
      this.instructionText$ = oWorkData.caseInfo.assignments[0].instructions;
    }


    // turn off spinner
    this.psService.sendMessage(false);


  }

  hasAssignments() {

    let hasAssignments = false;
    const assignmentsList = this.pConn$.getValue(this.pCoreConstants.CASE_INFO.D_CASE_ASSIGNMENTS_RESULTS);
    const thisOperator = this.PCore$.getEnvironmentInfo().getOperatorIdentifier();
    // 8.7 includes assignments in Assignments List that may be assigned to
    //  a different operator. So, see if there are any assignments for
    //  the current operator
    let bAssignmentsForThisOperator = false;

    // Bail if there is no assignmentsList
    if (!assignmentsList) {
      return hasAssignments;
    }

    for (const assignment of assignmentsList) {
      if (assignment["assigneeInfo"]["ID"] === thisOperator) {
        bAssignmentsForThisOperator = true;
      }
    }

    const hasChildCaseAssignments = this.hasChildCaseAssignments();

    if (
      bAssignmentsForThisOperator ||
      hasChildCaseAssignments ||
      this.isCaseWideLocalAction()
    ) {
      hasAssignments = true;
    }

    return hasAssignments;
  }

  isCaseWideLocalAction() {
    const actionID = this.pConn$.getValue(this.pCoreConstants.CASE_INFO.ACTIVE_ACTION_ID);
    const caseActions = this.pConn$.getValue(this.pCoreConstants.CASE_INFO.AVAILABLEACTIONS);
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

    const childCases = this.pConn$.getValue(this.pCoreConstants.CASE_INFO.CHILD_ASSIGNMENTS);
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

/*
*** renove this commmented out code when React/WC is updated
*** this code is replace with the call to "getToDoAssigments" function below

          const assignmentsList = localPConn.getValue(
            CASE_CONSTS.D_CASE_ASSIGNMENTS_RESULTS
          );
                  // add status
          const status = localPConn.getValue("caseInfo.status");

          let localAssignment = JSON.parse(JSON.stringify(assignmentsList[0]));
          localAssignment.status = status;
          let locaAssignmentsList: Array<any> = [];
          locaAssignmentsList.push(localAssignment);

          const caseActions = localPConn.getValue(CASE_CONSTS.CASE_INFO_ACTIONS);
*/
        
          const todoAssignments = this.getToDoAssignments(this.pConn$);

          if (todoAssignments && todoAssignments.length > 0) {
            this.todo_caseInfoID$ = this.pConn$.getValue(CASE_CONSTS.CASE_INFO_ID);
            this.todo_datasource$ = { source: todoAssignments };
          }


  /* remove this commented out code when update React/WC */
          //let kid = this.pConn$.getChildren()[0];

          // kid.getPConnect() can be a Reference component. So normalize it just in case
  //        let todoKid = ReferenceComponent.normalizePConn(kid.getPConnect()).getChildren()[0];

  //        this.todo_pConn$ = todoKid.getPConnect();


  /* code change here to note for React/WC  */
          // todo now needs pConn to open the work item on click "go"
          this.todo_pConn$ = this.pConn$;

          // still needs the context of the original work item
          this.todo_context$ = localPConn.getContextName();

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
       // Temp fix for 8.7 change: confirmationNote no longer coming through in caseMessages$.
       // So, if we get here and caseMessages$ is empty, use default value in DX API response
       if (!this.caseMessages$) {
         this.caseMessages$ = "Thank you! The next step in this case has been routed appropriately.";
       }

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

                  this.todo_context$ = currentItem.context;

                  config["options"] = {
                    context: currentItem.context,
                    pageReference: context || localPConn.getPageReference(),
                    hasForm: true,
                    isFlowContainer: true,
                    containerName: localPConn.getContainerName(),
                    containerItemName: key,
                    parentPageReference: localPConn.getPageReference()
                  };

                  const configObject = this.PCore$.createPConnect(config);
                  // 8.7 - config might be a Reference component so, need to normalize it to get
                  //  the View if it is a Reference component. And need to pass in the getPConnect
                  //  to have normalize do a c11Env createComponent (that makes sure options.hasForm
                  //  is passed along to all the component's children)
                  const normalizedConfigObject = ReferenceComponent.normalizePConn(configObject.getPConnect());
                  // We want the children to be the PConnect itself, not the result of calling getPConnect(),
                  //  So need to get the PConnect of the normalized component we just created...
                  const normalizedConfigObjectAsPConnect = normalizedConfigObject.getComponent();


                  // makes sure Angular tracks these changes
                  this.ngZone.run(() => {

                    this.buildName$ = this.getBuildName();
                    // what comes back now in configObject is the children of the flowContainer

                    this.arChildren$ = new Array();
                    this.arChildren$.push(normalizedConfigObjectAsPConnect);

                    this.psService.sendMessage(false);

                    let oWorkItem = this.arChildren$[0].getPConnect();
                    let oWorkData = oWorkItem.getDataObject();

                    this.containerName$ = this.getActiveViewLabel() || oWorkData.caseInfo.assignments[0].name;
                    this.instructionText$ = oWorkData.caseInfo.assignments[0].instructions;
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



  // helpers - copyied from flow container helpers.js

  addContainerItem(pConnect) {
    // copied from flow container helper.js
    const containerManager = pConnect.getContainerManager();
    const contextName = pConnect.getContextName(); // here we will get parent context name, as flow container is child of view container
    const caseViewMode = pConnect.getValue("context_data.caseViewMode");
   
    let key;
    let flowName;
  
    if(caseViewMode !== "review") {
      const target = contextName.substring(0, contextName.lastIndexOf("_"));
      const activeContainerItemID = this.PCore$.getContainerUtils().getActiveContainerItemName(target);
      const containerItemData = this.PCore$.getContainerUtils().getContainerItemData(target, activeContainerItemID);
  
      if(containerItemData) {
        ({ key, flowName } = containerItemData);
      }
    }
  
    containerManager.addContainerItem({
      semanticURL: "",
      key,
      flowName,
      caseViewMode: "perform",
      resourceType: "ASSIGNMENT",
      data: pConnect.getDataObject(contextName)
    });
  }

  showTodo(pConnect) {
    const caseViewMode = pConnect.getValue("context_data.caseViewMode");
    return caseViewMode !== "perform";
  }

  getChildCaseAssignments(pConnect) {
    const childCases = pConnect.getValue(this.PCore$.getConstants().CASE_INFO.CHILD_ASSIGNMENTS);
    let allAssignments = [];
    if (childCases && childCases.length > 0) {
      childCases.forEach(({ assignments = [], Name }) => {
        const childCaseAssignments = assignments.map((assignment) => ({
          ...assignment,
          caseName: Name
        }));
        allAssignments = allAssignments.concat(childCaseAssignments);
      });
    }
    return allAssignments;
  }

  getActiveCaseActionName(pConnect) {
    const caseActions = pConnect.getValue(this.PCore$.getConstants().CASE_INFO.CASE_INFO_ACTIONS);
    const activeActionID = pConnect.getValue(this.PCore$.getConstants().CASE_INFO.ACTIVE_ACTION_ID);
    const activeAction = caseActions.find(
      (action) => action.ID === activeActionID
    );
    return activeAction?.name || "";
  }

  getToDoAssignments(pConnect) {
    const caseActions = pConnect.getValue(this.PCore$.getConstants().CASE_INFO.CASE_INFO_ACTIONS);
    const assignmentLabel = pConnect.getValue(this.PCore$.getConstants().CASE_INFO.ASSIGNMENT_LABEL);
    const assignments =
      pConnect.getValue(this.PCore$.getConstants().CASE_INFO.D_CASE_ASSIGNMENTS_RESULTS) || [];
    const childCasesAssignments = this.getChildCaseAssignments(pConnect) || [];
    let childCasesAssignmentsCopy = JSON.parse(
      JSON.stringify(childCasesAssignments)
    );
  
    childCasesAssignmentsCopy = childCasesAssignmentsCopy.map((assignment) => {
      assignment.isChild = true;
      return assignment;
    });
  
    const todoAssignments = [...assignments, ...childCasesAssignmentsCopy];
    let todoAssignmentsCopy = JSON.parse(JSON.stringify(todoAssignments));
  
    if (caseActions && !this.showTodo(pConnect)) {
      todoAssignmentsCopy = todoAssignmentsCopy.map((assignment) => {
        assignment.name = this.getActiveCaseActionName(pConnect) || assignmentLabel;
        return assignment;
      });
    }
  
    return todoAssignmentsCopy;
  }

   // helpers end

}