import { Component, OnInit, Input } from '@angular/core';
import { ChangeDetectorRef } from "@angular/core";
import { AngularPConnectService } from "../../../_bridge/angular-pconnect"
import { ProgressSpinnerService } from "../../../_messages/progress-spinner.service";
import { ErrorMessagesService } from "../../../_messages/error-messages.service";
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, Observable } from 'rxjs';
import { interval } from "rxjs/internal/observable/interval";
import { NgZone } from '@angular/core';



@Component({
  selector: 'app-app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss']
})
export class AppShellComponent implements OnInit {

  @Input() pConn$: any;


  configProps$ : Object;
  pages$: Array<any>;
  caseTypes$: Array<any>;
  arChildren$: Array<any>;
  bIsProgress$: boolean = false;

  bShowAppShell$: boolean = false;


  navExpandCollapse$: string = "plus";
  bShowCaseTypes$: boolean = false;
  appName$: string = "PEGA";

  // For interaction with AngularPConnect
  angularPConnectData: any = {};


  progressSpinnerMessage: any;
  progressSpinnerSubscription: Subscription;
  spinnerTimer: any = null;

  errorMessage: any;
  errorMessagesSubscription: Subscription;
  sErrorMessages: string = "";
  snackBarRef: any;
  bOkDisplayError : boolean = false;


  constructor( private angularPConnect: AngularPConnectService,
               private psService: ProgressSpinnerService,
               private erService: ErrorMessagesService,
               private snackBar: MatSnackBar,
               private ngZone: NgZone,
               private chRef: ChangeDetectorRef) {

  }

 

  ngOnInit() {
    // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);

    // Then, continue on with other initialization

    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());

    // making a copy, so can add info
    this.pages$ = this.configProps$["pages"];

   
    if (this.pages$) {
      this.bShowAppShell$ = true;
    }
    this.caseTypes$ = this.configProps$["caseTypes"];


    this.arChildren$ = this.pConn$.getChildren();

    // handle showing and hiding the progress spinner
    this.errorMessagesSubscription = this.erService.getMessage().subscribe(message => { 
      this.errorMessage = message;

      this.showDismissErrorMessages(this.errorMessage);
    });
  
  }

  ngOnDestroy(): void {
    if (this.angularPConnectData.unsubscribeFn) {
      this.angularPConnectData.unsubscribeFn();
    }

    if (this.progressSpinnerSubscription) {
      this.progressSpinnerSubscription.unsubscribe();
    }
    
  }

  // Callback passed when subscribing to store change
  onStateChange() {
    // Should always check the bridge to see if the component should
    // update itself (re-render)
    const bUpdateSelf = this.angularPConnect.shouldComponentUpdate( this );
  
    // ONLY call updateSelf when the component should update
    if (bUpdateSelf) {
      // Call method for the component to update itself when available
      this.updateSelf(); 
    }
  }

  updateSelf() {
    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());

    this.ngZone.run(() => {
      // making a copy, so can add info
      this.pages$ = this.configProps$["pages"];

      if (this.pages$) {
        this.bShowAppShell$ = true;
      }

      this.caseTypes$ = this.configProps$["caseTypes"];
      this.arChildren$ = this.pConn$.getChildren();
    });


  }


  // fpr show/hiding error messages in the SnackBar component
  showDismissErrorMessages(errorMessages: any) {
    switch (errorMessages.action) {
      case "update" :
        // won't show unless publish is turned on
        if (this.sErrorMessages.indexOf(errorMessages.actionMessage) < 0) {
          this.sErrorMessages = this.sErrorMessages.concat(errorMessages.actionMessage).concat("\n");

          if (this.bOkDisplayError) {
            let config = { panelClass: ['snackbar-newline'] };
            this.snackBarRef = this.snackBar.open(this.sErrorMessages,  "Ok", config);
          }


        }
        break;        
      case "show" :

        // add error message if not in the list
        // won't show unless publish is turned on
        if (this.sErrorMessages.indexOf(errorMessages.actionMessage) < 0) {
          this.sErrorMessages = this.sErrorMessages.concat(errorMessages.actionMessage).concat("\n");
        }

        if (this.bOkDisplayError) {
          let config = { panelClass: ['snackbar-newline'] };
          this.snackBarRef = this.snackBar.open(this.sErrorMessages,  "Ok", config);
        }
        // this.snackBarRef.afterDismissed().subscribe( info => {
        //     this.sErrorMessages = "";
        //   }
        // )
        break;
      case "dismiss" :
        // closes snack bar
        // turns publish off
        // clears out errors
        // should be called to dimiss and at "cancel"
        if (this.snackBarRef != null) {
          this.snackBarRef.dismiss();
          this.sErrorMessages = "";
          this.bOkDisplayError = false;
        }
        break;
      case "publish" :
        // allows errors to be shown, clears out existing ones
        // should be turned on at "submit" (finishAssignment, nextAssignment, etc.)

        this.bOkDisplayError = true;
        this.sErrorMessages = "";

        break;
    }
  }

}
