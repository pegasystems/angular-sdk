import { Component, OnInit, Inject } from '@angular/core';
import { GetLoginStatusService } from "../../../_messages/get-login-status.service";
import { ChangeDetectorRef } from "@angular/core";
import { Subscription, Observable } from 'rxjs';
import { ProgressSpinnerService } from "../../../_messages/progress-spinner.service";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { interval } from "rxjs/internal/observable/interval";
import { endpoints } from '../../../_services/endpoints';
import { UpdateWorklistService } from '../../../_messages/update-worklist.service';
import { NgZone } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ServerConfigService } from 'src/app/_services/server-config.service';



@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

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

  pConn$: any;
  PCore$: any;

  bootstrapShell: any;



  constructor(private glsservice: GetLoginStatusService, 
              private cdRef: ChangeDetectorRef,
              private snackBar: MatSnackBar,
              private settingsDialog: MatDialog,
              private psservice: ProgressSpinnerService,
              private uwservice: UpdateWorklistService,
              private titleService: Title,
              private scservice: ServerConfigService,
              private ngZone: NgZone) { }

  ngOnInit() {

 
    this.scservice.getServerConfig().then( () => {
      this.initialize();
    });

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.progressSpinnerSubscription.unsubscribe();
    this.resetPConnectSubscription.unsubscribe();

    this.PCore$.getPubSubUtils().unsubscribe(
      this.PCore$.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL,
      "cancelAssignment"
    );

    this.PCore$.getPubSubUtils().unsubscribe(
      "assignmentFinished",
      "assignmentFinished"
    );

    this.PCore$.getPubSubUtils().unsubscribe(
      "showWork",
      "showWork"
    );
  }


  initialize() {

    if (sessionStorage.getItem("userFullName")) {
      // if have a userName, then have already logged in
      this.bLoggedIn$ = true;

      this.userName$ = sessionStorage.getItem("userFullName");

      this.titleService.setTitle("Sinple Portal");

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

            this.cdRef.detectChanges();
          }


        }

    );

  }


  showWork() {

      this.bootstrapShell.loadMashup('app-root', false);


      // update the worklist
      this.uwservice.sendMessage(true);

      this.ngZone.run(() => {
        this.bPConnectLoaded$ = true;
      });
  }

  cancelAssignment() {

    setTimeout(() => {


      // update the worklist
      this.uwservice.sendMessage(true);

      this.ngZone.run(() => {
        this.bPConnectLoaded$ = false;
      });

    });

  }

  assignmentFinished() {

    setTimeout(() => {

      // update the worklist
      this.uwservice.sendMessage(true);

      this.ngZone.run(() => {
        this.bPConnectLoaded$ = false;
      });
    });
  }


  getPConnectAndUpdate() {
    let sConfig = sessionStorage.getItem("bootstrapConfig");


    if (sConfig && sConfig != "") {
      let oConfig = JSON.parse(sConfig);
      //oConfig["serviceConfig"].staticContentServer = "http://localhost:3000/";
      //oConfig["restServerConfig"] = "http://localhost:1080";

      let sContentServer = window.location.href.indexOf("?code") != -1 ? window.location.href.substring(0, window.location.href.indexOf("?code")) + "/" : window.location.href + "/";
      if (null != endpoints.SIMPLEPORTALHTML && endpoints.SIMPLEPORTALHTML != "" && sContentServer.indexOf("/" + endpoints.SIMPLEPORTALHTML) >= 0) {
        sContentServer = sContentServer.substring(0, sContentServer.indexOf(endpoints.SIMPLEPORTALHTML));
      }
      else if (null != endpoints.SIMPLEPORTAL && endpoints.SIMPLEPORTAL != "" && sContentServer.indexOf("/" + endpoints.SIMPLEPORTAL) >= 0) {
        sContentServer = sContentServer.substring(0, sContentServer.indexOf(endpoints.SIMPLEPORTAL));
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

        
      window.PCore.onPCoreReady( (renderObj) => {


        if (!this.PCore$) {
          this.PCore$ = window.PCore;
        }

        // Change to reflect new use of arg in the callback:
        const { props /*, domContainerID = null */ } = renderObj;

        // makes sure Angular tracks these changes
        this.ngZone.run(() => {
          this.pConn$ = props.getPConnect();

          this.bHasPConnect$ = true;
          this.bPConnectLoaded$ = true;

          sessionStorage.setItem("pCoreUsage", "AngularSDKMashup");
        });

        //
        // so don't have multiple subscriptions, unsubscribe first
        //
        this.PCore$.getPubSubUtils().unsubscribe(
          this.PCore$.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL,
          "cancelAssignment"
        );
    
        this.PCore$.getPubSubUtils().unsubscribe(
          "assignmentFinished",
          "assignmentFinished"
        );
    
        this.PCore$.getPubSubUtils().unsubscribe(
          "showWork",
          "showWork"
        );


        //
        // now subscribe
        //
        this.PCore$.getPubSubUtils().subscribe(
          this.PCore$.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL,
          () => { this.cancelAssignment() },
          "cancelAssignment"
        );
    
        this.PCore$.getPubSubUtils().subscribe(
          "assignmentFinished",
          () => { this.assignmentFinished() },
          "assignmentFinished"
        );
    
        this.PCore$.getPubSubUtils().subscribe(
          "showWork",
          () => { this.showWork() },
          "showWork"
        );



      } );

      // //alert("loaded");
      bootstrapShell.loadMashup('app-root', false);


    });
  }
  





  logOff() {
    this.glsservice.sendMessage("LoggedOff");
    
  }

}







