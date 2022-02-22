import { Component, OnInit, Input, OnChanges, SimpleChanges, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { UserService } from "../_services/user.service";
import { GetLoginStatusService } from "../_messages/get-login-status.service";
import { DatapageService } from "../_services/datapage.service";
import { ProgressSpinnerService } from "../_messages/progress-spinner.service";
import { interval } from "rxjs/internal/observable/interval";
import { MatSnackBar } from '@angular/material/snack-bar';
import { OAuthResponseService } from '../_messages/oauth-response.service';
import { Subscription, Observable } from 'rxjs';
import { ServerConfigService } from '../_services/server-config.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginData: any = {};
  clientID$: string;


  // default
  loginType$: string;
  bShowLogin$: boolean = false;

  oAuthResponseSubscription: Subscription;
  

  constructor(private uservice: UserService, 
              private glsservice: GetLoginStatusService,
              private dservice: DatapageService,
              private snackBar: MatSnackBar,
              private psservice: ProgressSpinnerService,
              private scservice: ServerConfigService,
              private oarservice: OAuthResponseService ) {

    if (sessionStorage.getItem('loginType') ) {
      this.loginType$ = sessionStorage.getItem('loginType');
    }
    else {
      this.loginType$ = "BASIC";
    }

  }

  userNameControl = new FormControl('', null);
  passwordControl = new FormControl('', null);
  clientIDControl = new FormControl('', null);




  ngOnInit() {

/*
    this.scservice.getServerConfig().then(() => {

      this.oAuthResponseSubscription = this.oarservice.getMessage().subscribe(message => {
  
        if (message.token) { 
          this.loadFromOAuth(message.token);

        }
  
      });
*/
  this.oAuthResponseSubscription = this.oarservice.getMessage().subscribe(message => {
    
    if (message.token) { 
      this.loadFromOAuth(message.token);
    }
  });

  this.scservice.getServerConfig().then(() => {


      const authConfig = this.scservice.getSdkConfigAuth();
      const configClientID = authConfig.portalClientId;
      const redirectInProcess = this.uservice.isRedirectInProgress();
      const tokenInfo = this.uservice.getCurrentTokens();

      if (tokenInfo) {
        this.bShowLogin$ = false;
      }
      else {
        this.bShowLogin$ = true;
      }

      this.loginType$ = "OAUTH";

      if( !redirectInProcess ) {
        if( !tokenInfo ) {
          setTimeout(() => {
            this.attemptLogin();
          });        
        } else {
          this.initLogin();
          this.uservice.loginIfNecessary();
        }
      }     
    });
    
  }

  initLogin() {
    this.clientID$ = sessionStorage.getItem("clientID");
    if (this.clientID$) {
      this.clientIDControl.setValue(this.clientID$);
    }

    this.userNameControl.setValue('');
    this.passwordControl.setValue('');
  }



  loadFromOAuth(token: any) {
    this.psservice.sendMessage(true);

    let operatorParams = new HttpParams()

    //this.scservice.getServerConfig().then(() => {

      if (this.scservice.hasDefinedAppPortal()) {
        sessionStorage.setItem("userPortal", this.scservice.getAppPortal());
        sessionStorage.setItem("loginType", this.loginType$);

        this.dservice.getDataPage("D_pxBootstrapConfig", {}).subscribe(
          response => {
            this.psservice.sendMessage(false);
  
            let myConfig : any = response.body;

            sessionStorage.setItem("bootstrapConfig", myConfig.pyConfigJSON);

            this.glsservice.sendMessage("LoggedIn");
          },
          err => {
            this.psservice.sendMessage(false);
                    
            let sError = "Errors getting config: " + err.message;
            let snackBarRef = this.snackBar.open(sError, "Ok");
          }
        );
      }
      else {
        this.dservice.getDataPage("D_OperatorID", operatorParams).subscribe(
          response1 => {
    
            let operator: any = response1.body;
            sessionStorage.setItem("loginType", this.loginType$);
            sessionStorage.setItem("userFullName", operator.pyUserName);
            sessionStorage.setItem("userAccessGroup", operator.pyAccessGroup);
            sessionStorage.setItem("userWorkGroup", operator.pyWorkGroup);
            sessionStorage.setItem("userWorkBaskets", JSON.stringify(operator.pyWorkBasketList));
    
            // get access group info, so can get operator portal.
            // portal stored in localStorage and used for "loadPortal"
            this.dservice.getDataPage("D_OperatorAccessGroups", {}).subscribe(
              response2 => {
    
                let operAG: any = response2.body;
    
                sessionStorage.setItem("userPortal", this.getPortal(sessionStorage.getItem("userAccessGroup"), operAG.pxResults));
    
                this.dservice.getDataPage("D_pxBootstrapConfig", {}).subscribe(
                  response3 => {
                    this.psservice.sendMessage(false);
          
                    let myConfig : any = response3.body;
        
                    sessionStorage.setItem("bootstrapConfig", myConfig.pyConfigJSON);
        
                    this.glsservice.sendMessage("LoggedIn");
                  },
                  err => {
                    this.psservice.sendMessage(false);
                            
                    let sError = "Errors getting config: " + err.message;
                    let snackBarRef = this.snackBar.open(sError, "Ok");
                    this.uservice.login();
                  }
                );
              }
            )
          },
          err => {
            this.uservice.login();
          });

      }

 

    //});

 
  }

  getPortal(sAccessGroup, arAccessGroups) {
    for (let ag of arAccessGroups) {
      if (ag.pyAccessGroup == sAccessGroup) {
        return ag.pyPortal;
        break;
      }
    }

    return "";
  }


  doLogin() {
    // delay, so on change for password value can get in

    let timer = interval(100).subscribe(() => {
      this.attemptLogin();
      timer.unsubscribe();
      });

  }

  attemptLogin() {

    this.uservice.login();
    
  }

  fieldChanged(e) {
    this.loginData[e.target.id] = e.target.value;

  }

  clientIDChanged(e) {
    sessionStorage.setItem(e.target.id, e.target.value);
  }

  loginTypeChanged(e) {
    this.loginType$ = e.value;

    sessionStorage.setItem("loginType", this.loginType$);
    this.clientID$ = sessionStorage.getItem("clientID");


  }


}
