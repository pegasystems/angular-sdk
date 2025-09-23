import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';

import { loginIfNecessary, logout } from '@pega/auth/lib/sdk-auth-manager';
import { ServerConfigService, UpdateWorklistService, compareSdkPCoreVersions, getSdkComponentMap } from '@pega/angular-sdk-components';

import { SideBarComponent } from '../side-bar/side-bar.component';
import { MainContentComponent } from '../main-content/main-content.component';
import localSdkComponentMap from '../../../../../sdk-local-component-map';

declare global {
  interface Window {
    myLoadMashup: Function;
  }
}

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    SideBarComponent,
    MainContentComponent
  ]
})
export class NavigationComponent implements OnInit, OnDestroy {
  pConn$: typeof PConnect;

  bLoggedIn$ = false;
  bPConnectLoaded$ = false;
  bHasPConnect$ = false;
  userName$ = '';
  isProgress$ = false;
  progressSpinnerSubscription: Subscription;
  resetPConnectSubscription: Subscription;

  constructor(
    private uwservice: UpdateWorklistService,
    private scservice: ServerConfigService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.scservice.readSdkConfig().then(() => {
      this.initialize();
    });
  }

  ngOnDestroy() {
    this.progressSpinnerSubscription.unsubscribe();
    this.resetPConnectSubscription.unsubscribe();

    PCore.getPubSubUtils().unsubscribe(PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL, 'cancelAssignment');

    PCore.getPubSubUtils().unsubscribe('assignmentFinished', 'assignmentFinished');

    PCore.getPubSubUtils().unsubscribe('showWork', 'showWork');
  }

  initialize() {
    // Add event listener for when logged in and constellation bootstrap is loaded
    document.addEventListener('SdkConstellationReady', () => {
      this.bLoggedIn$ = true;
      // start the portal
      this.startMashup();
    });

    // Add event listener for when logged out
    document.addEventListener('SdkLoggedOut', () => {
      this.bLoggedIn$ = false;
    });

    /* Login if needed (and indicate this is a portal scenario) */
    // const sAppName = location.pathname.substring(location.pathname.indexOf('/') + 1);
    loginIfNecessary({ appName: 'simpleportal', mainRedirect: true });
  }

  showWork() {
    window.myLoadMashup('app-root', false);

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

  startMashup() {
    PCore.onPCoreReady(renderObj => {
      // Initialize the SdkComponentMap (local and pega-provided)
      getSdkComponentMap(localSdkComponentMap).then((theComponentMap: any) => {
        console.log(`SdkComponentMap initialized`, theComponentMap);

        // Don't call initialRender until SdkComponentMap is fully initialized
        this.initialRender(renderObj);
      });
    });

    window.myLoadMashup('app-root', false); // this is defined in bootstrap shell that's been loaded already
  }

  initialRender(renderObj) {
    // Check that we're seeing the PCore version we expect
    compareSdkPCoreVersions();

    // Need to register the callback function for PCore.registerComponentCreator
    //  This callback is invoked if/when you call a PConnect createComponent
    PCore.registerComponentCreator(c11nEnv => {
      // debugger;

      // experiment with returning a PConnect that has deferenced the
      //  referenced View if the c11n is a 'reference' component
      const compType = c11nEnv.getPConnect().getComponentName();
      console.log(`navigation - registerComponentCreator c11nEnv type: ${compType}`);

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
    const { props } = renderObj;

    // makes sure Angular tracks these changes
    this.ngZone.run(() => {
      this.pConn$ = props.getPConnect();

      this.bHasPConnect$ = true;
      this.bPConnectLoaded$ = true;

      sessionStorage.setItem('pCoreUsage', 'AngularSDKMashup');
    });

    //
    // so don't have multiple subscriptions, unsubscribe first
    //
    PCore.getPubSubUtils().unsubscribe(PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL, 'cancelAssignment');

    PCore.getPubSubUtils().unsubscribe('assignmentFinished', 'assignmentFinished');

    PCore.getPubSubUtils().unsubscribe('showWork', 'showWork');

    //
    // now subscribe
    //
    PCore.getPubSubUtils().subscribe(
      PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL,
      () => {
        this.cancelAssignment();
      },
      'cancelAssignment'
    );

    PCore.getPubSubUtils().subscribe(
      'assignmentFinished',
      () => {
        this.assignmentFinished();
      },
      'assignmentFinished'
    );

    PCore.getPubSubUtils().subscribe(
      'showWork',
      () => {
        this.showWork();
      },
      'showWork'
    );
  }

  logOff() {
    logout().then(() => {
      // Reload the page to kick off the login
      window.location.reload();
    });
  }
}
