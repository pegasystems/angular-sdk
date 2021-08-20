import { Component, OnInit, Inject } from '@angular/core';
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
import { AutoLoginService } from "../../../_services/auto-login.service";
import { DatapageService } from "../../../_services/datapage.service";
import { HttpParams } from '@angular/common/http';
import { Utils } from "../../../_helpers/utils";
import { Title } from '@angular/platform-browser';
import { ServerConfigService } from 'src/app/_services/server-config.service';



@Component({
  selector: 'app-mc-nav',
  templateUrl: './mc-nav.component.html',
  styleUrls: ['./mc-nav.component.scss'],
  providers: [Utils]
})
export class MCNavComponent implements OnInit {

  starterPackVersion$: string = endpoints.SP_VERSION;

  bLoggedIn$: boolean = false;
  bPConnectLoaded$ : boolean = false;
  bHasPConnect$ : boolean = false;
  userName$: string = "";
  subscription: Subscription;
  isProgress$: boolean = false;


  progressSpinnerMessage: any;
  progressSpinnerSubscription: Subscription;
  resetPConnectSubscription: Subscription;

  pConn$: any;
  PCore$: any;

  bootstrapShell: any;

  constructor(private glsservice: GetLoginStatusService, 
              private cdRef: ChangeDetectorRef,
              private snackBar: MatSnackBar,
              private settingsDialog: MatDialog,
              private psservice: ProgressSpinnerService,
              private rpcservice: ResetPConnectService,
              private uwservice: UpdateWorklistService,
              private alservice: AutoLoginService,
              private dservice: DatapageService,
              private titleServide: Title,
              private scservice: ServerConfigService,
              private utils: Utils) { }

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
    if (!this.PCore$) {
      this.PCore$ = window.PCore;
    }

    this.titleServide.setTitle("Media Co");

    sessionStorage.clear();

    this.alservice.login().subscribe(
      response => {
        if (response.status == 200) {

          this.bLoggedIn$ = true;

          let loginData: any = response.body;

          sessionStorage.setItem("loginType", "OAUTH");
          sessionStorage.setItem("oauthUser", "Bearer " + loginData.access_token);

          let operatorParams = new HttpParams()

          let sConfig = sessionStorage.getItem("bootstrapConfig");

          // if have it in localstorage, don't need to get config again
          if (!sConfig || sConfig === "") {
            this.dservice.getDataPage("D_OperatorID", operatorParams).subscribe(
              response => {
  
              
                let operator: any = response.body;
                //sessionStorage.setItem("loginType", this.loginType$);
                sessionStorage.setItem("userFullName", operator.pyUserName);
                sessionStorage.setItem("userAccessGroup", operator.pyAccessGroup);
                sessionStorage.setItem("userWorkGroup", operator.pyWorkGroup);
                sessionStorage.setItem("userWorkBaskets", JSON.stringify(operator.pyWorkBasketList));

                this.dservice.getDataPage("D_pxBootstrapConfig", {}).subscribe(
                  response => {
                    this.psservice.sendMessage(false);
          
                    let myConfig : any = response.body;
        
                    sessionStorage.setItem("bootstrapConfig", myConfig.pyConfigJSON);
      
                    //this.glsservice.sendMessage("LoggedIn");
                    this.getPConnectAndUpdate();
       
      
      
                  },
                  err => {
                    this.psservice.sendMessage(false);
                            
                    let sError = "Errors getting config: " + err.message;
                    let snackBarRef = this.snackBar.open(sError, "Ok");
                  }
                );
  
   
                
              },
              err => {
                this.psservice.sendMessage(false);
  
                let sError = "Errors getting data page: " + err.message;
                let snackBarRef = this.snackBar.open(sError, "Ok");
              }
            );
          }
          else {
            this.psservice.sendMessage(false);
          
            //this.glsservice.sendMessage("LoggedIn");
            this.getPConnectAndUpdate();
          }

 

          
        }
      },
      err => {

        let snackBarRef = this.snackBar.open(err.message, "Ok");
        this.glsservice.sendMessage("LoggedOut");
        sessionStorage.clear();
      }
    );

    if (sessionStorage.getItem("userFullName")) {
      // if have a userName, then have already logged in
      this.bLoggedIn$ = true;

      this.userName$ = sessionStorage.getItem("userFullName");

      this.getPConnectAndUpdate();

     }


    this.subscription = this.glsservice.getMessage().subscribe(
        message => {
          if (message.loginStatus === 'LoggedIn') {
            this.bLoggedIn$ = true;
            this.userName$ = sessionStorage.getItem("userFullName");
        
            this.getPConnectAndUpdate();

          }
          else {
            this.bLoggedIn$ = false;

            // save last login type, before clear out local storage
            let loginType = sessionStorage.getItem("loginType");

            sessionStorage.clear();

            // resetlogin type
            sessionStorage.setItem("loginType", loginType);

            this.cdRef.detectChanges();
          }


        }

    );

    // handle showing and hiding the progress spinner
    this.progressSpinnerSubscription = this.psservice.getMessage().subscribe(message => { 
      this.progressSpinnerMessage = message;

      this.showHideProgress(this.progressSpinnerMessage.show);
    });

    this.resetPConnectSubscription = this.rpcservice.getMessage().subscribe(message => {

      if (message.reset) {
        this.bPConnectLoaded$ = false;

        ///window.PCore = null;

        let timer = interval(1000).subscribe(() => {

          //this.getPConnectAndUpdate();
          this.bootstrapShell.loadMashup('app-root', false);

          // update the worklist
          this.uwservice.sendMessage(true);

          timer.unsubscribe();
        });

       
      }

    });
  }

  getPConnectAndUpdate() {
    let sConfig = sessionStorage.getItem("bootstrapConfig");


    if (sConfig && sConfig != "") {
      let oConfig = JSON.parse(sConfig);
      //oConfig["serviceConfig"].staticContentServer = "http://localhost:3000/";
      //oConfig["restServerConfig"] = "http://localhost:1080";

      let sContentServer = window.location.href.indexOf("?code") != -1 ? window.location.href.substring(0, window.location.href.indexOf("?code")) + "/" : window.location.href + "/";
      if (null != endpoints.MASHUPHTML && endpoints.MASHUPHTML != "" && sContentServer.indexOf("/" + endpoints.MASHUPHTML) >=0 ) {
        sContentServer = sContentServer.substring(0, sContentServer.indexOf(endpoints.MASHUPHTML));
      }
      else if (null != endpoints.MASHUP && endpoints.MASHUP != "" && sContentServer.indexOf("/" + endpoints.MASHUP) >=0 ) {
        sContentServer = sContentServer.substring(0, sContentServer.indexOf(endpoints.MASHUP));
      }
      else if (null != endpoints.EMBEDDEDHTML && endpoints.EMBEDDEDHTML != "" && sContentServer.indexOf("/" + endpoints.EMBEDDEDHTML) >= 0) {
        sContentServer = sContentServer.substring(0, sContentServer.indexOf(endpoints.EMBEDDEDHTML));
      }
      else if (null != endpoints.EMBEDDED && endpoints.EMBEDDED != "" && sContentServer.indexOf("/" + endpoints.EMBEDDED) >= 0) {
        sContentServer = sContentServer.substring(0, sContentServer.indexOf(endpoints.EMBEDDED));
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

      if (sContentServer == "" || sContentServer.lastIndexOf("/") != sContentServer.length -1) {
        sContentServer = sContentServer.concat("/");
      }

      // import bootstrap-shell from /dist
      import(/* webpackIgnore: true */ `${sContentServer}/bootstrap-shell.js`).then((bootstrapShell) => {

        this.pConnectUpdate(oConfig, bootstrapShell);
      });

 
    }

  }


  pConnectUpdate(oConfig: any, bootstrapShell: any) {
    this.bootstrapShell = bootstrapShell;

    bootstrapShell.bootstrap(oConfig).then(() => {

      if (!this.PCore$) {
        this.PCore$ = window.PCore;
      }
      
      this.PCore$.onPCoreReady( (renderObj) => {


        // Change to reflect new use of arg in the callback:
        const { props /*, domContainerID = null */ } = renderObj;

        this.pConn$ = props.getPConnect();

        this.bHasPConnect$ = true;
        this.bPConnectLoaded$ = true;

        this.showHideProgress(false);

        sessionStorage.setItem("pCoreUsage", "AngularSDKMashup");


      } );

      bootstrapShell.loadMashup('app-root', false);


    });

  }

  

  showHideProgress(bShow: boolean) {
    this.isProgress$ = bShow;
    this.cdRef.detectChanges();
  }



  logOff() {
    this.glsservice.sendMessage("LoggedOff");
    
  }

}







