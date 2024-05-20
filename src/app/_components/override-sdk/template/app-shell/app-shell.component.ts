import { Component, OnInit, Input, NgZone, forwardRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AngularPConnectData, AngularPConnectService } from '@pega/angular-sdk-components';
import { ErrorMessagesService } from '@pega/angular-sdk-components';
import { ComponentMapperComponent } from '@pega/angular-sdk-components';

interface IPage {
  classID: string;
  pxPageViewIcon: string;
  pyClassName: string;
  pyLabel: string;
  pyRuleName: string;
  pyURLContent: string;
}

interface AppShellProps {
  // If any, enter additional props that only exist on this component
  pages: IPage[];
  caseTypes?: object[];
  portalLogo: string;
  portalName: string;
  portalTemplate: string;
  readOnly?: boolean;
  showAppHeaderBar: boolean;
  showAppName: boolean;
}

@Component({
  selector: 'app-app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, forwardRef(() => ComponentMapperComponent)]
})
export class AppShellComponent implements OnInit, OnDestroy {
  @Input() pConn$: typeof PConnect;

  // For interaction with AngularPConnect
  angularPConnectData: AngularPConnectData = {};
  configProps$: AppShellProps;

  pages$: IPage[];
  caseTypes$?: object[];
  arChildren$: any[];
  bShowAppShell$ = false;
  appName$ = 'PEGA';
  errorMessagesSubscription: Subscription;
  sErrorMessages = '';
  snackBarRef: any;
  bOkDisplayError = false;
  portalTemplate: string;
  links: any = [];

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

    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps()) as AppShellProps;

    // making a copy, so can add info
    this.pages$ = this.configProps$.pages;

    this.links = this.pages$.filter((page, index) => {
      return index !== 0;
    });

    if (this.pages$) {
      this.bShowAppShell$ = true;
    }
    this.caseTypes$ = this.configProps$.caseTypes;

    this.arChildren$ = this.pConn$.getChildren() as any[];

    this.portalTemplate = this.configProps$.portalTemplate;

    // handle showing and hiding the progress spinner
    this.errorMessagesSubscription = this.erService.getMessage().subscribe(message => {
      this.showDismissErrorMessages(message);
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
    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps()) as AppShellProps;

    this.ngZone.run(() => {
      // making a copy, so can add info
      this.pages$ = this.configProps$.pages;

      if (this.pages$) {
        this.bShowAppShell$ = true;
      }

      this.caseTypes$ = this.configProps$.caseTypes;
      this.arChildren$ = this.pConn$.getChildren() as any[];
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
            const config = { panelClass: ['snackbar-newline'], duration: 5000 };
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

        this.bOkDisplayError = true;

        if (this.bOkDisplayError) {
          const config = { panelClass: ['snackbar-newline'], duration: 5000 };
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
      default:
        break;
    }
  }
}
