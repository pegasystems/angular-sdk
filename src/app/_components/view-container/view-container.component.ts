import { Component, OnInit, Input } from '@angular/core';
import { AngularPConnectService } from "../../_bridge/angular-pconnect";
import { FormGroup } from '@angular/forms';
import { NgZone } from '@angular/core';
import { interval } from "rxjs/internal/observable/interval";
import { ProgressSpinnerService } from "../../_messages/progress-spinner.service";
import { Utils } from '../../_helpers/utils';
import { ReferenceComponent } from '../reference/reference.component';
import { ConstantPool } from '@angular/compiler';

//
// WARNING:  It is not expected that this file should be modified.  It is part of infrastructure code that works with
// Redux and creation/update of Redux containers and PConnect.  Modifying this code could have undesireable results and
// is totally at your own risk.
//

@Component({
  selector: 'app-view-container',
  templateUrl: './view-container.component.html',
  styleUrls: ['./view-container.component.scss']
})
export class ViewContainerComponent implements OnInit {

  @Input() pConn$: any;
  @Input() formGroup$: FormGroup;
  @Input() displayOnlyFA$: boolean;


//  configProps$ : Object;
  arChildren$: Array<any>;
  configProps$ : Object;
  templateName$: string;
  buildName$: string;
  context$: string;
  title$: string = "";

  viewPConn$: any;

  isViewContainer$: boolean = true;

  // JA - created object is now a View with a Template
  //  Use its PConnect to render the CaseView; DON'T replace this.pConn$
  createdViewPConn$ : any;
  state: any;
  dispatchObject: any;

  // local
  localRoutingInfo: string = "";

  actionsMessage: any;

  // For interaction with AngularPConnect
  angularPConnectData: any = null;

  PCore$: any;


  constructor(private angularPConnect: AngularPConnectService,
              private psService: ProgressSpinnerService,
              private ngZone: NgZone,
              private utils: Utils) {

  }



  ngOnInit() {


    if (this.PCore$ == null) {
      this.PCore$ = window.PCore;
    }

    if (this.displayOnlyFA$ == null) {
      this.displayOnlyFA$ = false;
    }

    //debugger;

    // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);

    // Then, continue on with other initialization

//    this.configProps$ = this.pConn$.getConfigProps();
    // children may have a 'reference' so normalize the children array
    this.arChildren$ = ReferenceComponent.normalizePConnArray( this.pConn$.getChildren() );

    this.buildName$ = this.buildName();
    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());
    this.templateName$ = ('template' in this.configProps$) ? this.configProps$["template"] : "";
    this.title$ = ('title' in this.configProps$) ? this.configProps$["title"] : "";
    const { CONTAINER_TYPE, APP } = this.PCore$.getConstants();
    const { name, mode, limit, loadingInfo} = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());

    this.pConn$.isBoundToState();

    const containerMgr = this.pConn$.getContainerManager();


    this.prepareDispatchObject = this.prepareDispatchObject.bind(this);

    this.dispatchObject = this.prepareDispatchObject();


    // TODO: Plan is to rename window.constellationCore to window.pega (or similar)
    //    And expose less via ui-bootstrap.js
    this.state = {
      dispatchObject: this.dispatchObject,
      // PCore is defined in pxBootstrapShell - eventually will be exported in place of constellationCore
       

      visible: !this.PCore$["checkIfSemanticURL"]()
    };


    // here, to match Nebula/Constellation, the constructor of ViewContainer is only called once, and thus init/add container is only
    // called once.  Because of Angular creating and destroy components if the parent changes a lot, this component will be
    // created and destroyed more than once.  So the sessionStore "hasViewContainer" is set to false in rootContainer and then
    // after first round is true here.  Subsequent ViewContainer creation will not init/add more containers.

    if (sessionStorage.getItem("hasViewContainer") == "false") {

      // unlike Nebula/Constellation, have to initializeContainer after we create a dispatcObject and state, otherwise, when calling
      // initializeContainer before, code will get executed that needs state that wasn't defined.

      containerMgr.initializeContainers({
        type:
          mode === CONTAINER_TYPE.MULTIPLE
            ? CONTAINER_TYPE.MULTIPLE
            : CONTAINER_TYPE.SINGLE
      });

      if (mode === CONTAINER_TYPE.MULTIPLE && limit) {
        /* NOTE: setContainerLimit use is temporary. It is a non-public, unsupported API. */
        this.PCore$.getContainerUtils().setContainerLimit(`${APP.APP}/${name}`, limit);
      }
    }




    if (sessionStorage.getItem("hasViewContainer") == "false") {

      if (this.pConn$.getMetadata()["children"]) {
          containerMgr.addContainerItem(this.dispatchObject);

      }

      sessionStorage.setItem("hasViewContainer", "true");
    }


    // cannot call checkAndUpdate becasue first time through, will call updateSelf and that is incorrect (causes issues).
    // however, need angularPConnect to be initialized with currentProps for future updates, so calling shouldComponentUpdate directly
    // without checking to update here in init, will initialize and this is correct
    this.angularPConnect.shouldComponentUpdate( this );

  }

  ngOnDestroy() {

    if (this.angularPConnectData.unsubscribeFn) {
      this.angularPConnectData.unsubscribeFn();
    }

  }


  // Callback passed when subscribing to store change
  onStateChange() {
    this.checkAndUpdate();
  }

  checkAndUpdate() {
    // Should always check the bridge to see if the component should
    // update itself (re-render)
    const bUpdateSelf = this.angularPConnect.shouldComponentUpdate( this );
  
    // ONLY call updateSelf when the component should update
    if (bUpdateSelf) {
      this.updateSelf();
    }
  }


  updateSelf() {
    //   *** DON'T call updateSelf in ngInit!!  ***

    // Don't need to get new store use the one we have
    const newState = this.angularPConnect.getState();

    if (this.arChildren$ == null) {
      // children may have a 'reference' so normalize the children array
      this.arChildren$ = ReferenceComponent.normalizePConnArray( this.pConn$.getChildren() );


    }

    const bShowLoading: boolean = this.angularPConnect.getComponentProp(this,"loadingInfo");


    // routingInfo was added as component prop in populateAdditionalProps
    let routingInfo = this.angularPConnect.getComponentProp(this,"routingInfo");

    let loadingInfo;
    try {
      loadingInfo = this.pConn$.getLoadingStatus();

      this.psService.sendMessage(loadingInfo);
    }
    catch (ex) {

    }

    const buildName = this.buildName();
    const { CREATE_DETAILS_VIEW_NAME } = this.PCore$.getConstants();
    if (routingInfo) {
      const { accessedOrder, items } = routingInfo;
      if (accessedOrder && items) {
        const key = accessedOrder[accessedOrder.length - 1];
        let componentVisible = accessedOrder.length > 0;
        const { visible } = this.state;
        componentVisible = visible || componentVisible;
        if (
          items[key] &&
          items[key].view &&
          Object.keys(items[key].view).length > 0
        ) {
          const latestItem = items[key];
          const rootView = latestItem.view;
          const { context, name: viewName } = rootView.config;
          const config = { meta: rootView };
          config["options"] = {
            context: latestItem.context,
            pageReference: context || this.pConn$.getPageReference(),
            containerName: this.pConn$.getContainerName(),
            containerItemName: key,
            hasForm: viewName === CREATE_DETAILS_VIEW_NAME
          };
          const configObject = this.PCore$.createPConnect(config);

          // THIS is where the ViewContainer creates a View
          //    The config has meta.config.type = "view"
          const newComp = configObject.getPConnect();
          const newCompName = newComp.getComponentName();
          // The metadata for pyDetails changed such that the "template": "CaseView"
          //  is no longer a child of the created View but is in the created View's
          //  config. So, we DON'T want to replace this.pConn$ since the created
          //  component is a View (and not a ViewContainer). We now look for the
          //  "template" type directly in the created component (newComp) and NOT
          //  as a child of the newly created component.

          // Use the newly created component (View) info but DO NOT replace
          //  this ViewContainer's pConn$, etc.
          //  Note that we're now using the newly created View's PConnect in the
          //  ViewContainer HTML template to guide what's rendered similar to what
          //  the Nebula/Constellation return of React.Fragment does

          this.ngZone.run(() => {

            if (newComp.getComponentName() === 'reference') {

              // if a refernece, it will de reference to a "view"
              // so hand this off to the "View" component to do that
              this.isViewContainer$ = false;
              this.viewPConn$ = newComp;


              /*
              ***  this commmented out code should be removed, once we test out that
              ***  handing off refernce to View component always works
               */

              // When newComp is a reference, we want to de-reference
              //  it (to get the View) and then use that View to get the
              //  template, title, children, etc.

              /*

              const theDereferencedView = ReferenceComponent.normalizePConn(newComp);
              const newConfigProps = theDereferencedView.getConfigProps();

              // children may have a 'reference' so normalize the children arra
               
              const theDereferencedViewChildren = ReferenceComponent.normalizePConnArray(theDereferencedView.getChildren());
              this.templateName$ = ('template' in newConfigProps) ? newConfigProps["template"] : "";
              this.title$ = ('title' in newConfigProps) ? newConfigProps["title"] : "";
              this.arChildren$ = theDereferencedViewChildren;
              this.createdViewPConn$ = theDereferencedView;
              */
              

            } 
            else {
              // old style when newComp is NOT a 'reference'
              this.isViewContainer$ = true;

              console.error(`ViewContainer has a newComp that is NOT a reference!`)

              this.createdViewPConn$ = newComp;
              const newConfigProps = newComp.getConfigProps();
              this.templateName$ = ('template' in newConfigProps) ? newConfigProps["template"] : "";
              this.title$ = ('title' in newConfigProps) ? newConfigProps["title"] : "";
              // update children with new view's children
              // children may have a 'reference' so normalize the children array
              this.arChildren$ = ReferenceComponent.normalizePConnArray(newComp.getChildren());
              }



          });


        }
      }
    }


  }


  prepareDispatchObject(): any {
    //const { getPConnect } = this.configProps$;
    const pConn = this.pConn$;
    const baseContext = pConn.getContextName();
    const { acName = "primary" } = pConn.getContainerName();

    return {
      semanticURL: "",
      context: baseContext,
      acName
    };
  }

  buildName(): string {

    let sContext = this.pConn$.getContextName();
    let sName = this.pConn$.getContainerName();

    return sContext.toUpperCase() + "/" + sName.toUpperCase();


  }

}