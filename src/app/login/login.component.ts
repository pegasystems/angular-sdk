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

    this.scservice.getServerConfig().then(() => {

      this.oAuthResponseSubscription = this.oarservice.getMessage().subscribe(message => {
  
        if (message.token) { 
          this.loadFromOAuth(message.token);

        }
  
      });


      const authConfig = this.scservice.getSdkConfigAuth();
      const configClientID = authConfig.portalClientId;
      const redirectInProcess = sessionStorage.getItem("redirectInProcess");

      if (configClientID != "") {
        this.bShowLogin$ = false;
      }
      else {
        this.bShowLogin$ = true;
      }

      if (configClientID != "" && !redirectInProcess) {
        sessionStorage.setItem("redirectInProcess", "true");
        sessionStorage.setItem("clientID", configClientID);

        // have client ID in config, so redirect to pega login screen
        this.loginType$ = "OAUTH";

        setTimeout(() => {
          this.attemptLogin();
        });
        

      }
      else {
        this.initLogin();
        
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
          response => {
    
            let operator: any = response.body;
            sessionStorage.setItem("loginType", this.loginType$);
            sessionStorage.setItem("userFullName", operator.pyUserName);
            sessionStorage.setItem("userAccessGroup", operator.pyAccessGroup);
            sessionStorage.setItem("userWorkGroup", operator.pyWorkGroup);
            sessionStorage.setItem("userWorkBaskets", JSON.stringify(operator.pyWorkBasketList));
    
            // get access group info, so can get operator portal.
            // portal stored in localStorage and used for "loadPortal"
            this.dservice.getDataPage("D_OperatorAccessGroups", {}).subscribe(
              response => {
    
                let operAG: any = response.body;
    
                sessionStorage.setItem("userPortal", this.getPortal(sessionStorage.getItem("userAccessGroup"), operAG.pxResults));
    
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
            )
    
            
    
    
    
          });

      }

 

    //});

 
  }

  hasToken() {


    return this.uservice.verifyHasTokenOauth();



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

    sessionStorage.setItem("loginType", this.loginType$);

    if (this.loginType$ === "BASIC") {
      this.psservice.sendMessage(true);

      this.uservice.login(this.loginData.userName, this.loginData.password).subscribe(
        response => {
          if (response.status == 200) {
            let operatorParams = new HttpParams()
  
            this.dservice.getDataPage("D_OperatorID", operatorParams).subscribe(
              response => {
  
                
  
                let operator: any = response.body;
                sessionStorage.setItem("loginType", this.loginType$);
                sessionStorage.setItem("userFullName", operator.pyUserName);
                sessionStorage.setItem("userAccessGroup", operator.pyAccessGroup);
                sessionStorage.setItem("userWorkGroup", operator.pyWorkGroup);
                sessionStorage.setItem("userWorkBaskets", JSON.stringify(operator.pyWorkBasketList));
                
                this.dservice.getDataPage("D_pxBootstrapConfig",{}).subscribe(
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
    
                
              },
              err => {
                this.psservice.sendMessage(false);
  
                let sError = "Errors getting data page: " + err.message;
                let snackBarRef = this.snackBar.open(sError, "Ok");
              }
            );
  
  
  
            
          }
        },
        err => {
  
          let snackBarRef = this.snackBar.open(err.message, "Ok");
          this.glsservice.sendMessage("LoggedOut");
          sessionStorage.clear();
        }
      );

    }
    else if (this.loginType$ === "OAUTH") {

        this.clientID$ = sessionStorage.getItem("clientID");
        this.uservice.loginOauth(this.clientID$);


    }

    
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
