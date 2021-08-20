import { Component, OnInit, Input } from '@angular/core';
import { AngularPConnectService } from "../../_bridge/angular-pconnect";
import { FormGroup } from '@angular/forms';
import { NgZone } from '@angular/core';
import { interval } from "rxjs/internal/observable/interval";
import { ProgressSpinnerService } from "../../_messages/progress-spinner.service";
import { Utils } from '../../_helpers/utils';

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


    
    // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);

    // Then, continue on with other initialization

//    this.configProps$ = this.pConn$.getConfigProps();
    this.arChildren$ = this.pConn$.getChildren();
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
      /* eslint-disable-next-line no-undef */
      
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


  }

  ngOnDestroy() {
  
    if (this.angularPConnectData.unsubscribeFn) {
      this.angularPConnectData.unsubscribeFn();
    }

  }


  // Callback passed when subscribing to store change
  onStateChange() {

      // Should always check the bridge to see if the component should update itself (re-render)
    const bUpdateSelf = this.angularPConnect.shouldComponentUpdate( this );

    // ONLY call updateSelf when the component should update
    //    AND removing the "gate" that was put there since shouldComponentUpdate
    //      should be the real "gate"
    if (bUpdateSelf) {
      this.updateSelf();
    }



  } 


  updateSelf() {

    // Don't need to get new store use the one we have
    const newState = this.angularPConnect.getState();

    if (this.arChildren$ == null) {
      this.arChildren$ = this.pConn$.getChildren();


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

            this.createdViewPConn$ = newComp;
            const newConfigProps = newComp.getConfigProps();
            this.templateName$ = ('template' in newConfigProps) ? newConfigProps["template"] : "";
            this.title$ = ('title' in newConfigProps) ? newConfigProps["title"] : "";
            // update children with new view's children
            this.arChildren$ = newComp.getChildren();


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
