import { Component, OnInit, Inject, Optional, SkipSelf } from '@angular/core';
import { ChangeDetectorRef } from "@angular/core";
import { Subscription, Observable } from 'rxjs';
import { ProgressSpinnerService } from "../../../_messages/progress-spinner.service";
import { ResetPConnectService } from "../../../_messages/reset-pconnect.service";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { interval } from "rxjs/internal/observable/interval";
import { UpdateWorklistService } from '../../../_messages/update-worklist.service';
import { NgZone } from '@angular/core';
import { ServerConfigService } from '../../../_services/server-config.service';
import { compareSdkPCoreVersions } from '../../../_helpers/versionHelpers';
import { AuthService } from '../../../_services/auth.service';


declare global {
  interface Window {
    PCore: {
      onPCoreReady: Function;
      createPConnect: Function;
      getStore(): any;
      getConstants(): any;
      setBehaviorOverrides: Function;
      setBehaviorOverride: Function;
      getBehaviorOverrides: Function;
      getAttachmentUtils: Function;
      getDataApiUtils: Function;
      getAssetLoader: Function;
      getEnvironmentInfo: Function;
      getPubSubUtils(): any;
      getUserApi() : any;
      getAuthUtils(): any;
      registerComponentCreator( c11nPropObject ): Function;
    },
    myLoadPortal: Function;
    myLoadDefaultPortal: Function;
  }
}



@Component({
  selector: 'app-top-app-mashup',
  templateUrl: './top-app-mashup.component.html',
  styleUrls: ['./top-app-mashup.component.scss']
})




export class TopAppMashupComponent implements OnInit {


  sComponentName$: string;
  arChildren$: Array<any>;
  bPCoreReady$: boolean = false;

  pConn$: any;
  props$: any;
  PCore$: any;



  storeUnsubscribe : any;
  store: any;


  bLoggedIn$: boolean = false;
  bPConnectLoaded$ : boolean = false;
  bHasPConnect$ : boolean = false;
  userName$: string = "";
  subscription: Subscription;
  isProgress$: boolean = false;

  progressSpinnerMessage: any;
  progressSpinnerSubscription: Subscription;
  resetPConnectSubscription: Subscription;

  spinnerTimer: any;

  portalName: string;





  constructor(private aService: AuthService,
    private cdRef: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private settingsDialog: MatDialog,
    private psservice: ProgressSpinnerService,
    private rpcservice: ResetPConnectService,
    private uwservice: UpdateWorklistService,
    private ngZone: NgZone,
    private scservice: ServerConfigService
    ) {


  }

  ngOnInit() {

    this.scservice.getServerConfig().then( () => {
      this.initialize();
    });

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.progressSpinnerSubscription.unsubscribe();
    this.resetPConnectSubscription.unsubscribe();
  }


  initialize() {


    // handle showing and hiding the progress spinner
    this.progressSpinnerSubscription = this.psservice.getMessage().subscribe(message => {
      this.progressSpinnerMessage = message;

      this.showHideProgress(this.progressSpinnerMessage.show);
    });

    this.resetPConnectSubscription = this.rpcservice.getMessage().subscribe(message => {

      // if (message.reset) {
      //   this.bPConnectLoaded$ = false;

      //   ///window.PCore = null;

      //   let timer = interval(10).subscribe(() => {

      //     timer.unsubscribe();

      //     //this.getPConnectAndUpdate();
      //     loadPortal('app-root',this.portalName, [],"");
      //     //let sConfig = sessionStorage.getItem("savedConfig");

      //     //this.pConnectUpdate(JSON.parse(sConfig));

      //     // update the worklist
      //     this.uwservice.sendMessage(true);


      //   });


      // }

    });

    // Add event listener for when logged in and constellation bootstrap is loaded
    document.addEventListener("SdkConstellationReady", () => {
      this.bLoggedIn$ = true;
      // start the portal
      this.startPortal();
    });

    // Add event listener for when logged out
    document.addEventListener("SdkLoggedOut", () => {
      this.bLoggedIn$ = false;
    });
  
    /* Login if needed */
    const sAppName = location.pathname.substring(location.pathname.indexOf('/') + 1);
    this.aService.loginIfNecessary(sAppName, false);
  }

  startPortal() {

    window.PCore.onPCoreReady( (renderObj) => {
      // Check that we're seeing the PCore version we expect
      compareSdkPCoreVersions();

      /* In react initialRender happens here */

      // Need to register the callback function for PCore.registerComponentCreator
      //  This callback is invoked if/when you call a PConnect createComponent
      window.PCore.registerComponentCreator((c11nEnv, additionalProps = {}) => {
        // debugger;

        // experiment with returning a PConnect that has deferenced the
        //  referenced View if the c11n is a 'reference' component
        const compType = c11nEnv.getPConnect().getComponentName();
        // console.log( `top-app-mashup: startPortal - registerComponentCreator c11nEnv type: ${compType}`);        

        return c11nEnv;

        // REACT implementaion:
        // const PConnectComp = createPConnectComponent();
        // return (
        //     <PConnectComp {
        //       ...{
        //         ...c11nEnv,
        //         ...c11nEnv.getPConnect().getConfigProps(),
        //         ...c11nEnv.getPConnect().getActions(),
        //         additionalProps
        //       }}
        //     />
        //   );
      });

      // Change to reflect new use of arg in the callback:
      const { props /*, domContainerID = null */ } = renderObj;

      // makes sure Angular tracks these changes
      // this.ngZone.run(() => {
      //   this.pConn$ = props.getPConnect();

      //   this.bHasPConnect$ = true;
      //   this.bPConnectLoaded$ = true;

      //   //this.cdRef.detectChanges();
      //   this.showHideProgress(false);

      //   sessionStorage.setItem("pCoreUsage", "QuasarMashup");
      // });




      this.ngZone.run( () => {

        this.props$ = props;

        this.pConn$ = this.props$.getPConnect();

        this.sComponentName$ = this.pConn$.getComponentName();

        this.store = window.PCore.getStore();
        this.PCore$ = window.PCore;

        this.arChildren$ = this.pConn$.getChildren();


        this.bPCoreReady$ = true;



      });

    } );

    const thePortal = this.scservice.getAppPortal();
    const defaultPortal = window.PCore?.getEnvironmentInfo?.().getDefaultPortal?.();
    
    // Note: myLoadPortal and myLoadDefaultPortal are set when bootstrapWithAuthHeader is invoked
    if(thePortal){
      console.log(`Loading specified appPortal: ${thePortal}`);
      window.myLoadPortal("app-root", thePortal, []);   // this is defined in bootstrap shell that's been loaded already
    }else if(window.myLoadDefaultPortal && defaultPortal){
      console.log(`Loading default portal`);
      window.myLoadDefaultPortal("app-root", []);
    }else{
      // This path of selecting a portal by enumerating entries within current user's access group's portals list
      //  relies on Traditional DX APIs and should be avoided when the Constellation bootstrap supports
      //  the loadDefaultPortal API
      this.scservice.selectPortal()
      .then( () => {
        const selPortal = this.scservice.getAppPortal();
        window.myLoadPortal("app-root", selPortal, []);   // this is defined in bootstrap shell that's been loaded already
      })
    }
  }

  showHideProgress(bShow: boolean) {

    return;

    if (bShow) {

      if (!this.isProgress$) {
        // makes sure Angular tracks these changes

        this.spinnerTimer = interval(500).subscribe(() => {
          if (this.spinnerTimer) {
            this.spinnerTimer.unsubscribe();
            this.spinnerTimer = null;
          }

          this.ngZone.run(() => {
            this.isProgress$ = true;
          });

        });

      }


    }
    else {
      if (this.spinnerTimer != null) {
        this.spinnerTimer.unsubscribe();
        this.spinnerTimer = null;
      }

      // don't touch bIsProgress$ unless differnent
      if (bShow != this.isProgress$) {
        // makes sure Angular tracks these changes
        this.ngZone.run(() => {
          this.isProgress$ = bShow;
        });
      }


    }
  }







  doSubscribe() {

    window.PCore.onPCoreReady( (renderObj: any) => {
      // Check that we're seeing the PCore version we expect
      compareSdkPCoreVersions();

      // Need to register the callback function for PCore.registerComponentCreator
      //  This callback is invoked if/when you call a PConnect createComponent
      window.PCore.registerComponentCreator((c11nEnv, additionalProps = {}) => {
        // debugger;

        // experiment with returning a PConnect that has deferenced the
        //  referenced View if the c11n is a 'reference' component
        const compType = c11nEnv.getPConnect().getComponentName();
        console.log( `top-app-mashup: doSubscribe - registerComponentCreator c11nEnv type: ${compType}`);        

        return c11nEnv;

        // REACT implementaion:
        // const PConnectComp = createPConnectComponent();
        // return (
        //     <PConnectComp {
        //       ...{
        //         ...c11nEnv,
        //         ...c11nEnv.getPConnect().getConfigProps(),
        //         ...c11nEnv.getPConnect().getActions(),
        //         additionalProps
        //       }}
        //     />
        //   );
      });

      // Change to reflect new use of arg in the callback:
      const { props /*, domContainerID = null */ } = renderObj;

      this.ngZone.run( () => {
        this.props$ = props;

        this.pConn$ = this.props$.getPConnect();

        this.sComponentName$ = this.pConn$.getComponentName();

        this.store = window.PCore.getStore();
        this.PCore$ = window.PCore;

        this.arChildren$ = this.pConn$.getChildren();


        this.bPCoreReady$ = true;

      });




      sessionStorage.setItem("pCoreUsage", "AngularSDK");

    } );


    // this has to happen in a timeout, because detectChanges can NOT happen inside the
    // onPCoreReady, angular animations will not work.
    // can not be called from a service, as that is not asychronous
    // let timer = interval(50).subscribe(() => {

    //   if (this.bPCoreReady$) {

    //     this.cdRef.detectChanges();
    //     timer.unsubscribe();

    //   }

    //   });

 }






}
