import { Injectable } from '@angular/core';
import * as isEqual from 'fast-deep-equal';
import { ProgressSpinnerService } from "../_messages/progress-spinner.service";
import { ErrorMessagesService } from "../_messages/error-messages.service";
import { interval } from "rxjs/internal/observable/interval";
import { Utils } from "../_helpers/utils";



@Injectable({
  providedIn: 'root'
})
export class AngularPConnectService {

  /**
   * Local variable for access to the store once the service is connected to it.
   */
  private theStore: any = null;
  
  /**
   * Local variable used to compute the next componentID
   */
  private counterComponentID: number = 0;

  /**
   * Local array used to store the association of an component to its most recent "props"
   *  where "props" is the object containing the component's getConfigProps along with
   * anything added by populateAdditionalProps.
   * Each entry is: { __componentID__: _the component's most recent props_ }
   */
  private componentPropsArr: Array<Object> = [];


  constructor(private psService: ProgressSpinnerService,
              private erService: ErrorMessagesService,
              private utils: Utils) { 

                

    // Establish necessary override flags for our use of Core
    //const coreOverrides = { "dynamicLoadComponents": false };
    // let coreOverrides = window.PCore.getBehaviorOverrides();
    // coreOverrides["dynamicLoadComponents"] = false;
    // window.PCore.setBehaviorOverrides( coreOverrides );
    window.PCore.setBehaviorOverride("dynamicLoadComponents", false);

    // Always best to use deep object compare when it's available
    if (isEqual !== undefined) {
      //console.log(`AngularPConnect is using deep object compare`);
    } else {
      //console.log(`AngularPConnect is using JSON.stringify compare`);
    }

  }

  /**
   * Returns a unique (for this session) ComponentID that should
   * be used for that component to update its most recent props
   * (which can also be compared against its previous value
   * before updating). Note that this returns a string so we can use
   * it as a key in an associative array
   * @returns the next componentID
   */
  private getNextComponentId(): string {
    this.counterComponentID = this.counterComponentID + 1;
    // Note that we use the string version of the number so we have an
    //  associative array that we can clean up later, if needed.
    return this.counterComponentID.toString();
  }

  /**
   * The Calling object (inComp) subscribes to store changes.
   * @param inComp The component that's subscribing to the store
   * @param inCallback The component's callback function (typically called onStateChange) that will
   * be called when the store changes.
   * @returns The **unsubscribe** function that should be called when the component needs 
   * to unsubscribe from the store. (Typically during ngOnDestroy)
   */
  private subscribeToStore(inComp: object = null, inCallback: Function = null): Function {
    const theCompName: string = inComp ? `${inComp.constructor.name}` : "no component provided";
    let fnUnsubscribe = null
    //console.log( `Bridge subscribing: ${theCompName} `);
    if (inComp) {
        fnUnsubscribe = this.getStore().subscribe(inCallback);
    }
    return fnUnsubscribe;
  }

  /**
   * Gets the Component's properties that are used (a) to populate componentPropsArr
  //  and (b) to determine whether the component should update itself (re-render)
   * @param inComp The component whose properties are being obtained
   */
  private getComponentProps(inComp = null): Object {
    let compProps: any = {};
    let addProps = {};

    if (null === inComp) {
      console.error( `AngularPConnect: getComponentProps called with bad component: ${inComp}`);
    }

    // if ((inComp.constructor.name === "FlowContainerComponent") || (inComp.constructor.name === "ViewContainerComponent") 
    //     || (inComp.constructor.name === "ViewComponent") || (inComp.constructor.name === "DeferLoadComponent")) {
    //   console.log(`--> AngularPConnect getComponentProps: ${inComp.constructor.name}`);
    // }

    if (inComp.additionalProps !== undefined) {

      if (typeof inComp.additionalProps === "object") {
        addProps = inComp.pConn$.resolveConfigProps(inComp.additionalProps);
      } else if (typeof inComp.additionalProps === "function") {
        const propsToAdd = inComp.additionalProps(window.PCore.getStore().getState(), inComp.pConn$);
        addProps = inComp.pConn$.resolveConfigProps( propsToAdd );
      }
    }
    
    compProps = inComp.pConn$.getConfigProps();
    
    let componentName = inComp.constructor.name;

    // The following comment is from the Nebula/Constellation version of this code. Meant as a reminder to check this occasionally  
    // populate additional props which are component specific and not present in configurations
    // This block can be removed once all these props will be added as part of configs
    inComp.pConn$.populateAdditionalProps(compProps);
    

    compProps = inComp.pConn$.resolveConfigProps(compProps);

    if (compProps && (undefined !== compProps.validatemessage) && compProps.validatemessage != "") {
      //console.log( `   validatemessage for ${inComp.constructor.name} ${inComp.angularPConnectData.compID}: ${compProps.validatemessage}`);

    }

    return {
      ...compProps,
      ...addProps
    }

  }

   /**
   * Returns the unique id for given component created when registering 
   * Otherwise, return undefined.
   * @param inComp The component whose property is being requested.
   */
  public getComponentID(inComp): string {
    return inComp.angularPConnectData.compID;
  }

  /**
   * Returns the value of requested property for the component if it exists.
   * Otherwise, return undefined.
   * @param inComp The component whose property is being requested.
   * @param inProp The property being requested.
   */
  public getComponentProp(inComp = null, inProp = "" ) {
    let propVal;

    if (null === inComp) {
      console.error( `AngularPConnect: getComponentProp called with bad component: ${inComp}`);
    }

    const compID = inComp.angularPConnectData.compID;

    // Look up property in the component's entry in componentPropArray (which should have the most recent value)
    propVal = this.componentPropsArr[compID][inProp];

    return propVal;
  }


  /**
   * 
   * @returns The current complete set of resolved properties that are associated with
   * this component.
   * This is the full set of properties that are tracked in Redux for this component.
   */
  public getCurrentCompleteProps(inComp = null) {
    if (null === inComp) {
      console.error( `AngularPConnect: getCurrentCompleteProps called with bad component: ${inComp}`);
    }
    return this.componentPropsArr[inComp.angularPConnectData.compID] 
  } 

  /**
   * Registers the component and its callback function. When a component calls this method
   * (typically from its ngOnInit), the component is given a unique componentID (for this session)
   * and subscribes the component to the store. As a side effect, it also assigns the component's
   * actions (from its metadata) to the component's ___actions___ and binds the component's callback
   * (passed in as ___inCallback___) to the component. If a problem is encountered, an empty object,
   * {}, is returned.
   * @param inComp The component being registered and subscribed
   * @param inCallback The component's callback function (typically called onStateChange) that 
   * will be called whenever the state changes.
   * @returns A JSON object with the following keys:
   * compID: the unique ID associated with this component,
   * unsubscribeFn: the function to be called when the component needs to unsubscribe from the store,
   * validateMessage: any validation/error message that gets generated for this object,
   * actions: any actions that are defined for this object
   */
  registerAndSubscribeComponent (inComp, inCallback: Function = null): Object {
    // Create an initial object to be returned.
    let returnObject = {
      compID: "",
      unsubscribeFn: null,
      validateMessage: "",
      actions: null
    }

    if ((null === inComp) || (null === inCallback)) {
      console.error(`AngularPConnect: bad call to registerAndSubscribe: inComp: ${inComp} inCallback: ${inCallback}`);
      return returnObject;
    }

    const compType = inComp.constructor.name;

    if (undefined !== inComp.bridgeComponentID) {
      console.error( `OLD SCHOOL: ${compType}`);
    }

    
    if (undefined === inComp.actions && undefined === inComp.angularPConnectData) {
      console.error(`AngularPConnect: bad call to registerAndSubscribe from ${compType}: actions not defined as a class variable for inComp`);
      return returnObject;
    }
    if (undefined === inComp.bridgeComponentID && undefined === inComp.angularPConnectData) {
      console.error(`AngularPConnect: bad call to registerAndSubscribe from ${compType}: bridgeComponentID not defined as a class variable for inComp`);
      return returnObject;
    }
    if (undefined === inComp.unsubscribeStore && undefined === inComp.angularPConnectData) {
      console.error(`AngularPConnect: bad call to registerAndSubscribe from ${compType}: unsubscribeStore not defined as a class variable for inComp`);
      return returnObject;
    }
    if (undefined === inComp.validateMessage && undefined === inComp.angularPConnectData) {
      console.error(`AngularPConnect: bad call to registerAndSubscribe from ${compType}: validateMessage not defined as a class variable for inComp`);
      return returnObject;
    }


    // call processActions to populate metadata with actions as in PConnectHOR initialize
    this.processActions(inComp);
    if (undefined === inComp.actions) {
      returnObject.actions = inComp.pConn$.getActions();
    } else {
      inComp.actions = inComp.pConn$.getActions();
    }

    // bind the provided callback to the component it's associated with
    inCallback = inCallback.bind(inComp);

    // Now proceed to register and subscribe...
    const theCompID: string = this.getNextComponentId();
    const theUnsub: Function = this.subscribeToStore( inComp, inCallback);

    if (undefined === inComp.angularPConnectData) {
      inComp.bridgeComponentID = theCompID;
    } else {
      returnObject.compID = theCompID;
      returnObject.unsubscribeFn = theUnsub;
    }
    
    // initialize this components entry in the componentPropsArr
    this.componentPropsArr[theCompID] = {};

    // return object with compID and unsubscribe...
    return returnObject;
  }

  // Returns true if the component's entry in ___componentPropsArr___ is
  //  the same as the inCompProps passed in.
  //  As a side effect, update the component's entry in componentPropsArr
  //  NOTE: It is assumed that the incoming component has the following:
  //  * a bridgeComponentID <string> property - used as lookup key in componentPropsArr
  //  * a pConn$ <?> property - used to access functions accessed in getComponentProps
  // Return true: means the component props are different and the component should update itself (re-render)
  // Return false: means the component props are the same and the component doesn't need to update (re-render)
  //  On bad input, return false;
  /**
   * Returns **true** if the component's entry in ___componentPropsArr___ is
   * the same as the properties that are current associated with the component (___inComp___) passed in.
   * As a side effect, the component's entry in ___componentPropsArr___ is updated.
   * **Note**: It is assumed that the incoming component has the following:
   * (a) a bridgeComponentID _string_ property used as lookup key in ___componentPropsArr___
   * and (b) a ___pConn$___ property used to access functions called in ___getComponentProps___
   * 
   * @param inComp The component asking if it should update itself
   * @returns Return **true**: means the component props are different and the component should update itself (re-render).
   * Return **false**: means the component props are the same and the component doesn't need to update (re-render).
   * If the ***inComp*** input is bad, false is also returned.
   */
  shouldComponentUpdate( inComp ) : boolean {

    const bShowLogging = false;
    let bRet:boolean = false;
    // check for reasonable input
    if ({} === inComp) {
      console.error(`AngularPConnect: bad call to shouldComponentUpdate: inComp: ${JSON.stringify(inComp)}`);
      return bRet;
    }
    if (undefined === inComp.validateMessage && undefined === inComp.angularPConnectData) {
      console.error(`AngularPConnect: bad call to shouldComponentUpdate: ${inComp.constructor.name} does not have a validateMessage property.`);
    }

    const compID = (inComp.bridgeComponentID !== undefined) ? inComp.bridgeComponentID : inComp.angularPConnectData.compID;

    const currentProps = this.componentPropsArr[compID];
    const currentPropsAsStr: string = JSON.stringify(currentProps);

    let incomingProps: any = this.getComponentProps(inComp);

     // if have pageMessages, and it is blank, remove it.  This causes issues of making it appear
     // that a will cause an update, when there is no change
     if (incomingProps["pageMessages"] && incomingProps["pageMessages"].length == 0) {
       inComp.angularPConnectData.pageMessages = incomingProps["pageMessages"];
       delete incomingProps["pageMessages"];
     }

     if (incomingProps["httpMessages"]) {
      inComp.angularPConnectData.httpMessages = incomingProps["httpMessages"];
      delete incomingProps["httpMessages"];
    }


    let incomingPropsAsStr: string = JSON.stringify(incomingProps);

    // fast-deep-equal version
    if (isEqual !== undefined) {
      bRet = !isEqual(currentProps, incomingProps);
    } else{
      // stringify compare version
      if ( currentPropsAsStr != incomingPropsAsStr ) {
        bRet = true;
      }
    }

    // Now update the entry in componentPropsArr with the incoming value so
    //  we can compare against that next time...
    this.componentPropsArr[compID] = incomingProps;
    // and update the component's validation message (if undefined, it should be set to "")
    if (undefined !== inComp.angularPConnectData) {
      inComp.angularPConnectData.validateMessage = (incomingProps.validatemessage === undefined) ? "" : this.utils.htmlDecode(incomingProps.validatemessage);

      if ("" != inComp.angularPConnectData.validateMessage) {
        // if have a validate message, turn off spinner
        let timer = interval(100).subscribe(() => {
          this.psService.sendMessage(false);
  
          timer.unsubscribe();
          });

          let sErrorMessage = ( currentProps && currentProps["label"] ) ? currentProps["label"].concat(" - ") : "";
          sErrorMessage = sErrorMessage.concat(inComp.angularPConnectData.validateMessage);
          this.erService.sendMessage("update", sErrorMessage);
      }


    } else  {
      inComp.validateMessage = (incomingProps.validatemessage === undefined) ? "" : this.utils.htmlDecode(incomingProps.validatemessage);
    }

    //console.log( `AngularPConnect component ${compID} - ${inComp.constructor.name} - shouldComponentUpdate: ${bRet}`);

    if (bRet) {
      
      // console.log("current props: " + currentPropsAsStr);
      // console.log("incoming props: " + incomingPropsAsStr);
      // console.log(`    ${inComp.constructor.name}: shouldComponentUpdate returning: ${bRet}, compId: ${compID}` );

      //console.log( `    Updating with componentProps for ${inComp.constructor.name}: ${JSON.stringify(this.componentPropsArr[compID])}`);
       //console.log( `          and validateMessage: ${inComp.validateMessage}`);
    }
    // else if (inComp.constructor.name.indexOf("View") >= 0 || inComp.constructor.name.indexOf("Root") >= 0) {
    //   console.log("no change");
    //   console.log("current props: " + currentPropsAsStr);
    //   console.log("incoming props: " + incomingPropsAsStr);
    //   console.log(`    ${inComp.constructor.name}: shouldComponentUpdate returning: ${bRet}, compId: ${compID}` );

    // }

    //console.log(`    ${inComp.constructor.name}: shouldComponentUpdate returning: ${bRet}`);

    return bRet;
  }

  /**
   * Can be called when the component has encountered a change event
   * @param inComp The component calling the change event
   * @param event The event
   */
  changeHandler(inComp, event) {
    const bLogging = false;
    if (bLogging) {
      //console.log(`AngularPConnect.changeHandler`);
    }
    // check for reasonable input
    if (undefined === inComp || {} === inComp) {
      console.error(`AngularPConnect: bad call to changeHandler: inComp: ${JSON.stringify(inComp)}`);
      return;
    }

    const pConnect = inComp.pConn$;
    if (undefined === pConnect ) {
      console.error(`AngularPConnect: bad call to changeHandler: inComp.pConn$: ${pConnect}`);
      return;
    }


    // clear out errors
    this.erService.sendMessage("dismiss", "");

    pConnect.getActionsApi().changeHandler(pConnect, event);
  }

  /**
   * Can be called when the component has encountered an event (such as blur)
   * @param inComp The component calling the event
   * @param event The event
   */
  eventHandler(inComp, event) {
    const bLogging = false;
    if (bLogging) {
      //console.log(`AngularPConnect.eventHandler`);
    }
    // check for reasonable input
    if (undefined === inComp || {} === inComp) {
      console.error(`AngularPConnect: bad call to eventHandler: inComp: ${JSON.stringify(inComp)}`);
      return;
    }

    const pConnect = inComp.pConn$;
    if (undefined === pConnect ) {
      console.error(`AngularPConnect: bad call to eventHandler: inComp.pConn$: ${pConnect}`);
      return;
    }

    pConnect.getActionsApi().eventHandler(pConnect, event);
  }


  /**
   * @returns A handle to the application's store
   */
  getStore() {
      if (this.theStore === null) {
          this.theStore = window.PCore.getStore();
      }
    return this.theStore;
  }


  /**
   * @param bLogMsg If true, will write the stringified state to the store for debugging/inspection
   * @param inComp If supplied, the component that is requesting the store's state
   * @returns A handle to the __state__ of application's store
   */
  getState(bLogMsg: boolean = false, inComp: object = null) {
      const theState: object = this.getStore().getState();
      if (bLogMsg) {
          const theCompName: string = inComp ? `${inComp.constructor.name}: ` : "";
          console.log( `${theCompName} Store state: ${JSON.stringify(theState)}`);
      }
      return theState;
  }

  // processActions - carried over from PConnectHOC initialize
  /**
    *  processActions exposes all actions in the metadata.
    *  Attaches common handler (eventHandler) for all actions.
  */
  private processActions(inComp) {
    const pConnect = inComp.pConn$;
    if (undefined === pConnect) {
      console.error(`AngularPConnect: bad call to processActions: pConn$: ${pConnect} from component: ${inComp.constructor.name}`);
      return;
    }
    
    inComp.pConn$.processActions(inComp.pConn$.eventHandler);
    if (inComp.pConn$.isEditable()) {
      inComp.pConn$.setAction("onChange", this.changeHandler.bind(this));
      inComp.pConn$.setAction("onBlur", this.eventHandler.bind(this));
    }
  }  

}

// Set behavior overrides at load time
//  (in addition to constructor since that's too late for ui-bootstrap)
// check if window.PCore exists first.  In mashup, this will NOT exist until later
if (window.PCore) {
  // let coreOverrides = window.PCore.getBehaviorOverrides();
  // coreOverrides["dynamicLoadComponents"] = false;
  // window.PCore.setBehaviorOverrides( coreOverrides );
  window.PCore.setBehaviorOverride("dynamicLoadComponents", false);
}