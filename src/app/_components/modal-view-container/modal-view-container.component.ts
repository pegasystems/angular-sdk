import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AngularPConnectService } from "../../_bridge/angular-pconnect";
import { NgZone } from '@angular/core';
import { ProgressSpinnerService } from "../../_messages/progress-spinner.service";
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as isEqual from 'fast-deep-equal';

//
// WARNING:  It is not expected that this file should be modified.  It is part of infrastructure code that works with 
// Redux and creation/update of Redux containers and PConnect.  Modifying this code could have undesireable results and
// is totally at your own risk.
//


@Component({
  selector: 'app-modal-view-container',
  templateUrl: './modal-view-container.component.html',
  styleUrls: ['./modal-view-container.component.scss']
})
export class ModalViewContainerComponent implements OnInit {

  @Input() pConn$: any;
  @Input() displayOnlyFA$: boolean;
  
  // for when non modal
  @Output() modalVisibleChange = new EventEmitter<boolean>();

  arChildren$: Array<any>;
  configProps$ : Object;
  templateName$: string;
  buildName$: string;
  context$: string;
  title$: string = "";
  bShowModal$: boolean = false;
  bShowAsModal$: boolean = true;
  itemKey$: string;
  formGroup$: FormGroup;

 
  updateModalSub: Subscription;
  oCaseInfo: Object = {};

  routingInfoRef: Object = {};

  // created object is now a View with a Template
  //  Use its PConnect to render the CaseView; DON'T replace this.pConn$
  createdViewPConn$ : any;


  // Used with AngularPConnect
  angularPConnectData: any = {};

  bSubscribed: boolean = false;
  cancelPConn$: any;
  bShowCancelAlert$: boolean = false;
  bAlertState: boolean;

  PCore$: any;

  constructor(private angularPConnect: AngularPConnectService,
              private ngZone: NgZone,
              private psService: ProgressSpinnerService,
              private fb: FormBuilder) { 

    // create the formGroup
    this.formGroup$ = fb.group({ hideRequired: false});

  }

  ngOnInit(): void {

    if (!this.PCore$) {
      this.PCore$ = window.PCore;
    }

    if (this.displayOnlyFA$) {
      // for when non modal
      this.bShowAsModal$ = false;
    }

    // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);

    let baseContext = this.pConn$.getContextName();
    let acName = this.pConn$.getContainerName();

    //for now, in general this should be overridden by updateSelf(), and not be blank
    if (this.itemKey$ === "") {
      this.itemKey$ = baseContext.concat("/").concat(acName);
    }
    
    const containerMgr = this.pConn$.getContainerManager();

    containerMgr.initializeContainers({
      type: "multiple"
    });


    const { CONTAINER_TYPE, PUB_SUB_EVENTS } = this.PCore$.getConstants();

  }

  ngOnChanges(): void {

  }


  ngOnDestroy(): void {


    if (this.angularPConnectData.unsubscribeFn) {
      this.angularPConnectData.unsubscribeFn();
    }

    const { CONTAINER_TYPE, PUB_SUB_EVENTS } = this.PCore$.getConstants();

    this.PCore$.getPubSubUtils().unsubscribe(
      PUB_SUB_EVENTS.EVENT_SHOW_CANCEL_ALERT,
      PUB_SUB_EVENTS.EVENT_SHOW_CANCEL_ALERT /* Should be same unique string passed during subscription */
    );
    this.bSubscribed = false;

  } 

  // Callback passed when subscribing to store change
  onStateChange() {
    // Should always check the bridge to see if the component should
    // update itself (re-render)
    let bUpdateSelf = this.angularPConnect.shouldComponentUpdate( this );
  

    // ONLY call updateSelf when the component should update
    if (bUpdateSelf) {
      this.updateSelf();
    }
    else if (this.bShowModal$) {
      // right now onlu get one updated when initial diaplay.  So, once modal is up
      // let fall through and do a check with "compareCaseInfoIsDifferent" until fixed
      this.updateSelf();
    }




  }

  // updateSelf
  updateSelf(): void { 

    // routingInfo was added as component prop in populateAdditionalProps
    let routingInfo = this.angularPConnect.getComponentProp(this, "routingInfo");
    this.routingInfoRef["current"] = routingInfo;

    let loadingInfo;
    try {
      loadingInfo = this.pConn$.getLoadingStatus();
    }
    catch(ex) {

    }
    let configProps = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());


    if (!loadingInfo) {
      // turn off spinner
      //this.psService.sendMessage(false);
    }
  
    if (routingInfo && !loadingInfo /* && this.bUpdate */) {


      let currentOrder = routingInfo.accessedOrder;

      if (undefined == currentOrder) {
        return;
      }

      let currentItems = routingInfo.items;

      const { key, latestItem } = this.getKeyAndLatestItem(routingInfo);
   
      if (currentOrder.length > 0) {

        if (currentItems[key] &&
            currentItems[key].view &&
            Object.keys(currentItems[key].view).length > 0 ) {

          let currentItem = currentItems[key];
          let rootView = currentItem.view;
          let { context } = rootView.config;
          let config = { meta: rootView };
          config["options"] = {
            context: currentItem.context,
            hasForm: true,
            pageReference: context || this.pConn$.getPageReference()
          };

          if (!this.bSubscribed) {
            this.bSubscribed = true;
            const { CONTAINER_TYPE, PUB_SUB_EVENTS } = this.PCore$.getConstants();
            this.routingInfoRef["current"] = routingInfo;
            this.PCore$.getPubSubUtils().subscribe(
              PUB_SUB_EVENTS.EVENT_SHOW_CANCEL_ALERT,
              (payload) => { this.showAlert(payload); },
              PUB_SUB_EVENTS.EVENT_SHOW_CANCEL_ALERT,
              this.routingInfoRef
            );
          }

          //let configObject = this.PCore$.createPConnect(config);

          let configObject = this.getConfigObject(currentItem, this.pConn$);

          // THIS is where the ViewContainer creates a View
          //    The config has meta.config.type = "view"
          const newComp = configObject.getPConnect();
          const newCompName = newComp.getComponentName();
          const caseInfo = newComp && newComp.getDataObject() && newComp.getDataObject().caseInfo ? newComp.getDataObject().caseInfo : null;
          // The metadata for pyDetails changed such that the "template": "CaseView"
          //  is no longer a child of the created View but is in the created View's
          //  config. So, we DON'T want to replace this.pConn$ since the created
          //  component is a View (and not a ViewContainer). We now look for the
          //  "template" type directly in the created component (newComp) and NOT
          //  as a child of the newly created component.
          //console.log(`---> ModalViewContainer created new ${newCompName}`);

          // Use the newly created component (View) info but DO NOT replace
          //  this ModalViewContainer's pConn$, etc.
          //  Note that we're now using the newly created View's PConnect in the
          //  ViewContainer HTML template to guide what's rendered similar to what
          //  the Nebula/Constellation return of React.Fragment does


          // right now need to check caseInfo for changes, to trigger redraw, not getting 
          // changes from angularPconnect except for first draw
          if (newComp && caseInfo && this.compareCaseInfoIsDifferent(caseInfo)) {

            this.psService.sendMessage(false);

            this.ngZone.run(() => {
              this.createdViewPConn$ = newComp;
              const newConfigProps = newComp.getConfigProps();
              this.templateName$ = ('template' in newConfigProps) ? newConfigProps["template"] : "";

              const { actionName, isMinimizable } = latestItem;
              const caseInfo = newComp.getCaseInfo();
              const caseName = caseInfo.getName();
              const ID = caseInfo.getID();

              this.title$ = actionName || `New ${caseName} (${ID})`;
              // // update children with new view's children
              this.arChildren$ = newComp.getChildren();
              this.bShowModal$ = true;

              // for when non modal
              this.modalVisibleChange.emit(this.bShowModal$);
  
              // save off itemKey to be used for finishAssignment, etc.
              this.itemKey$ = key;  
            });
  
          }

        }

      }
      else {
        this.hideModal();
  
      }
    }


  }

  hideModal() {


    if (this.bShowModal$) {
      // other code in Nebula/Constellation not needed currently, but if so later, 
      // should put here
    }



    this.ngZone.run(() => {
      this.bShowModal$ = false;

      // for when non modal
      this.modalVisibleChange.emit(this.bShowModal$ );

      this.oCaseInfo = {};

    });
    
  }

  getConfigObject(item, pConnect) {
    if (item) {
      const { context, view } = item;
      const config = {
        meta: view,
        options: {
          context,
          pageReference: view.config.context || pConnect.getPageReference(),
          hasForm: true,
          containerName:
            pConnect?.getContainerName() || this.PCore$.getConstants().MODAL
        }
      };
      return this.PCore$.createPConnect(config);
    }
    return null;
  }


  onAlertState(bData: boolean) {
    this.bAlertState = bData;
    this.bShowCancelAlert$ = false;
    if (this.bAlertState == false) {
      this.hideModal();
    }
    
  }

  showAlert(payload) {


    const { latestItem } = this.getKeyAndLatestItem(this.routingInfoRef["current"]);
    const { isModalAction } = payload;

    /*
      If we are in create stage full page mode, created a new case and trying to click on cancel button
      it will show two alert dialogs which is not expected. Hence isModalAction flag to avoid that.
    */
    if (latestItem && isModalAction) {
      const configObject = this.getConfigObject(latestItem, this.pConn$);
      this.ngZone.run(() => {
        this.cancelPConn$ = configObject.getPConnect();
        this.bShowCancelAlert$ = true;
      });

    }
  }

  hasContainerItems(routingInfo) {
    if (routingInfo) {
      const { accessedOrder, items } = routingInfo;
      return accessedOrder && accessedOrder.length > 0 && items;
    }
    return false;
  }

  getKeyAndLatestItem(routinginfo) {
    if (this.hasContainerItems(routinginfo)) {
      const { accessedOrder, items } = routinginfo;
      const key = accessedOrder[accessedOrder.length - 1];
      const latestItem = items[key];
      return { key, latestItem };
    }
    return {};
  }

  compareCaseInfoIsDifferent(oCurrentCaseInfo: Object) : boolean {

    let bRet: boolean = false;

    // fast-deep-equal version
    if (isEqual !== undefined) {
      bRet = !isEqual(this.oCaseInfo, oCurrentCaseInfo);
    } else{
      let sCurrnentCaseInfo = JSON.stringify(oCurrentCaseInfo);
      let sOldCaseInfo = JSON.stringify(this.oCaseInfo);
      // stringify compare version
      if ( sCurrnentCaseInfo != sOldCaseInfo ) {
        bRet = true;
      }
    }
    
    // if different, save off new case info
    if (bRet) {
      this.oCaseInfo = JSON.parse(JSON.stringify(oCurrentCaseInfo));
    }

    return bRet;
  }




}
