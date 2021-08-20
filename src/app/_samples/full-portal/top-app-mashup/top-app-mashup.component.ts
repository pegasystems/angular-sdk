import { Component, OnInit, Inject, Optional, SkipSelf } from '@angular/core';
import { GetLoginStatusService } from "../../../_messages/get-login-status.service";
import { ChangeDetectorRef } from "@angular/core";
import { Subscription, Observable } from 'rxjs';
import { ProgressSpinnerService } from "../../../_messages/progress-spinner.service";
import { ResetPConnectService } from "../../../_messages/reset-pconnect.service";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { interval } from "rxjs/internal/observable/interval";
import { endpoints } from '../../../_services/endpoints';
import { UpdateWorklistService } from '../../../_messages/update-worklist.service';
import { NgZone } from '@angular/core';
import { ServerConfigService } from '../../../_services/server-config.service';


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
    }
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





  constructor(private glsservice: GetLoginStatusService, 
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
    if (sessionStorage.getItem("userFullName") && sessionStorage.getItem("userPortal")) {
      // if have a userName, then have already logged in
      this.bLoggedIn$ = true;

      this.userName$ = sessionStorage.getItem("userFullName");

      this.getPConnectAndUpdate();

     }


    this.subscription = this.glsservice.getMessage().subscribe(
        message => {
          if (message.loginStatus === 'LoggedIn') {
            this.ngZone.run(() => {
              this.bLoggedIn$ = true;
              this.userName$ = sessionStorage.getItem("userFullName");
            });
        
            this.getPConnectAndUpdate();

          }
          else {
            this.bLoggedIn$ = false;

            // save last login type, before clear out local storage
            let loginType = sessionStorage.getItem("loginType");

            sessionStorage.clear();

            // resetlogin type
            sessionStorage.setItem("loginType", loginType);

            //this.cdRef.detectChanges();
            setTimeout(() => {
              window.location.reload();
            })
           
          }


        }

    );

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
  }

  getPConnectAndUpdate() {
    let sConfig = sessionStorage.getItem("bootstrapConfig");

    this.portalName = sessionStorage.getItem("userPortal");

    if (sConfig && sConfig != "") {
      let oConfig = JSON.parse(sConfig);
      //oConfig["serviceConfig"].staticContentServer = "http://localhost:3000/";
      //oConfig["restServerConfig"] = "http://localhost:1080";

      let sContentServer = window.location.href.indexOf("?code") != -1 ? window.location.href.substring(0, window.location.href.indexOf("?code")) + "/" : window.location.href;
      if (null != endpoints.FULLPORTALHTML && endpoints.FULLPORTALHTML != "" && sContentServer.indexOf("/" + endpoints.FULLPORTALHTML) >= 0) {
        sContentServer = sContentServer.substring(0, sContentServer.indexOf(endpoints.FULLPORTALHTML));
      }
      else if (null != endpoints.FULLPORTAL && endpoints.FULLPORTAL != "" && sContentServer.indexOf("/" + endpoints.FULLPORTAL) >= 0) {
        sContentServer = sContentServer.substring(0, sContentServer.indexOf(endpoints.FULLPORTAL));
      }
      else if (null != endpoints.PORTALHMTL && endpoints.PORTALHMTL != "" && sContentServer.indexOf("/" + endpoints.PORTALHMTL) >= 0) {
        sContentServer = sContentServer.substring(0, sContentServer.indexOf(endpoints.PORTALHMTL));
      }
      else if (null != endpoints.PORTAL && endpoints.PORTAL != "" && sContentServer.indexOf("/" + endpoints.PORTAL) >= 0) {
        sContentServer = sContentServer.substring(0, sContentServer.indexOf(endpoints.PORTAL));
      }
      oConfig["serviceConfig"].staticContentServer = sContentServer;
      //oConfig["restServerConfig"] = endpoints.BASEURL.substring(0, endpoints.BASEURL.indexOf("/prweb"));
      oConfig["restServerConfig"] = this.scservice.getBaseUrl().substring(0, this.scservice.getBaseUrl().indexOf("/prweb"));
      oConfig["dynamicLoadComponents"] = false;
      oConfig["dynamicSemanticUrl"] = false;
      oConfig["dynamicSetCookie"] = false;

      let oHeaders = oConfig["additionalHeaders"];
      oHeaders["Content-Type"] = "application/x-www-form-urlencoded";

      if (sessionStorage.getItem("loginType") === "BASIC") {
        oHeaders["Authorization"] = "Basic " + sessionStorage.getItem("encodedUser");
      }
      else {
        // OATH
        oHeaders["Authorization"] = sessionStorage.getItem("oauthUser");
      }
      

      oConfig["additionalHeaders"] = oHeaders;

      sessionStorage.setItem("savedConfig", JSON.stringify(oConfig));

      this.showHideProgress(true);

      if (sContentServer == "" || sContentServer.lastIndexOf("/") != sContentServer.length -1) {
        sContentServer = sContentServer.concat("/");
      }

      // import bootstrap-shell from /dist
      import(/* webpackIgnore: true */ `${sContentServer}bootstrap-shell.js`).then((bootstrapShell) => {

        this.pConnectUpdate(oConfig, bootstrapShell);
      });



    }

  }

  pConnectUpdate(oConfig: any, bootstrapShell: any) {
    bootstrapShell.bootstrap(oConfig).then( () => {

        
      window.PCore.onPCoreReady( (renderObj) => {


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


      bootstrapShell.loadPortal('app-root', this.portalName, [], null);

      // //alert("loaded");
      //loadMashup('app-root', false);



    },
    (err) => {
      alert("error");
    }
    
    );
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
      if (null != this.spinnerTimer) {
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
