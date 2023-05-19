import { Component, OnInit, NgZone } from '@angular/core';
import { Subscription } from 'rxjs';

import { UpdateWorklistService } from 'src/app/_messages/update-worklist.service';
import { AuthService } from 'src/app/_services/auth.service';
import { ServerConfigService } from 'src/app/_services/server-config.service';
import { compareSdkPCoreVersions } from 'src/app/_helpers/versionHelpers';

declare global {
  interface Window {
    myLoadMashup: Function;
  }
}

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  PCore$: any;
  pConn$: any;

  bLoggedIn$: boolean = false;
  bPConnectLoaded$: boolean = false;
  bHasPConnect$: boolean = false;
  userName$: string = '';
  isProgress$: boolean = false;
  progressSpinnerSubscription: Subscription;
  resetPConnectSubscription: Subscription;

  constructor(
    private aService: AuthService,
    private uwservice: UpdateWorklistService,
    private scservice: ServerConfigService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.scservice.getServerConfig().then(() => {
      this.initialize();
    });
  }

  ngOnDestroy() {
    this.progressSpinnerSubscription.unsubscribe();
    this.resetPConnectSubscription.unsubscribe();

    this.PCore$.getPubSubUtils().unsubscribe(this.PCore$.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL, 'cancelAssignment');

    this.PCore$.getPubSubUtils().unsubscribe('assignmentFinished', 'assignmentFinished');

    this.PCore$.getPubSubUtils().unsubscribe('showWork', 'showWork');
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
    //const sAppName = location.pathname.substring(location.pathname.indexOf('/') + 1);
    this.aService.loginIfNecessary('simpleportal', false);
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
    window.PCore.onPCoreReady((renderObj) => {
      // Check that we're seeing the PCore version we expect
      compareSdkPCoreVersions();

      if (!this.PCore$) {
        this.PCore$ = window.PCore;
      }

      // Need to register the callback function for PCore.registerComponentCreator
      //  This callback is invoked if/when you call a PConnect createComponent
      window.PCore.registerComponentCreator((c11nEnv, additionalProps = {}) => {
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
      this.PCore$.getPubSubUtils().unsubscribe(this.PCore$.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL, 'cancelAssignment');

      this.PCore$.getPubSubUtils().unsubscribe('assignmentFinished', 'assignmentFinished');

      this.PCore$.getPubSubUtils().unsubscribe('showWork', 'showWork');

      //
      // now subscribe
      //
      this.PCore$.getPubSubUtils().subscribe(
        this.PCore$.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL,
        () => {
          this.cancelAssignment();
        },
        'cancelAssignment'
      );

      this.PCore$.getPubSubUtils().subscribe(
        'assignmentFinished',
        () => {
          this.assignmentFinished();
        },
        'assignmentFinished'
      );

      this.PCore$.getPubSubUtils().subscribe(
        'showWork',
        () => {
          this.showWork();
        },
        'showWork'
      );
    });

    window.myLoadMashup('app-root', false); // this is defined in bootstrap shell that's been loaded already
  }

  logOff() {
    this.aService.logout().then(() => {
      // Reload the page to kick off the login
      window.location.reload();
    });
  }
}
