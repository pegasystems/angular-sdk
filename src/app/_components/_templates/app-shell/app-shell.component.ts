import { Component, OnInit, Input, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AngularPConnectService } from '../../../_bridge/angular-pconnect';
import { ErrorMessagesService } from '../../../_messages/error-messages.service';

@Component({
  selector: 'app-app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
})
export class AppShellComponent implements OnInit {
  @Input() pConn$: any;

  // For interaction with AngularPConnect
  angularPConnectData: any = {};
  configProps$: Object;

  pages$: Array<any>;
  caseTypes$: Array<any>;
  arChildren$: Array<any>;
  bShowAppShell$: boolean = false;
  appName$: string = 'PEGA';
  errorMessage: any;
  errorMessagesSubscription: Subscription;
  sErrorMessages: string = '';
  snackBarRef: any;
  bOkDisplayError: boolean = false;

  constructor(
    private angularPConnect: AngularPConnectService,
    private erService: ErrorMessagesService,
    private snackBar: MatSnackBar,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);

    // Then, continue on with other initialization

    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());

    // making a copy, so can add info
    this.pages$ = this.configProps$['pages'];

    if (this.pages$) {
      this.bShowAppShell$ = true;
    }
    this.caseTypes$ = this.configProps$['caseTypes'];

    this.arChildren$ = this.pConn$.getChildren();

    // handle showing and hiding the progress spinner
    this.errorMessagesSubscription = this.erService.getMessage().subscribe((message) => {
      this.errorMessage = message;

      this.showDismissErrorMessages(this.errorMessage);
    });

    // cannot call checkAndUpdate becasue first time through, will call updateSelf and that is incorrect (causes issues).
    // however, need angularPConnect to be initialized with currentProps for future updates, so calling shouldComponentUpdate directly
    // without checking to update here in init, will initialize and this is correct
    this.angularPConnect.shouldComponentUpdate(this);
  }

  ngOnDestroy(): void {
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
    const bUpdateSelf = this.angularPConnect.shouldComponentUpdate(this);

    // ONLY call updateSelf when the component should update
    if (bUpdateSelf) {
      this.updateSelf();
    }
  }

  updateSelf() {
    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());

    this.ngZone.run(() => {
      // making a copy, so can add info
      this.pages$ = this.configProps$['pages'];

      if (this.pages$) {
        this.bShowAppShell$ = true;
      }

      this.caseTypes$ = this.configProps$['caseTypes'];
      this.arChildren$ = this.pConn$.getChildren();
    });
  }

  // fpr show/hiding error messages in the SnackBar component
  showDismissErrorMessages(errorMessages: any) {
    switch (errorMessages.action) {
      case 'update':
        // won't show unless publish is turned on
        // eslint-disable-next-line @typescript-eslint/prefer-includes
        if (this.sErrorMessages.indexOf(errorMessages.actionMessage) < 0) {
          this.sErrorMessages = this.sErrorMessages.concat(errorMessages.actionMessage).concat('\n');

          if (this.bOkDisplayError) {
            let config = { panelClass: ['snackbar-newline'] };
            this.snackBarRef = this.snackBar.open(this.sErrorMessages, 'Ok', config);
          }
        }
        break;
      case 'show':
        // add error message if not in the list
        // won't show unless publish is turned on
        // eslint-disable-next-line @typescript-eslint/prefer-includes
        if (this.sErrorMessages.indexOf(errorMessages.actionMessage) < 0) {
          this.sErrorMessages = this.sErrorMessages.concat(errorMessages.actionMessage).concat('\n');
        }

        if (this.bOkDisplayError) {
          let config = { panelClass: ['snackbar-newline'] };
          this.snackBarRef = this.snackBar.open(this.sErrorMessages, 'Ok', config);
        }
        // this.snackBarRef.afterDismissed().subscribe( info => {
        //     this.sErrorMessages = "";
        //   }
        // )
        break;
      case 'dismiss':
        // closes snack bar
        // turns publish off
        // clears out errors
        // should be called to dimiss and at "cancel"
        if (this.snackBarRef != null) {
          this.snackBarRef.dismiss();
          this.sErrorMessages = '';
          this.bOkDisplayError = false;
        }
        break;
      case 'publish':
        // allows errors to be shown, clears out existing ones
        // should be turned on at "submit" (finishAssignment, nextAssignment, etc.)

        this.bOkDisplayError = true;
        this.sErrorMessages = '';

        break;
    }
  }
}
