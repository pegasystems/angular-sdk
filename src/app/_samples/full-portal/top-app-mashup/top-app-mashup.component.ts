import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { loginIfNecessary, logout, getAvailablePortals } from '@pega/auth/lib/sdk-auth-manager';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { interval, Subscription } from 'rxjs';
import { ProgressSpinnerService } from '@pega/angular-sdk-library';
import { compareSdkPCoreVersions } from '@pega/angular-sdk-library';
import { RootContainerComponent } from '@pega/angular-sdk-library';
import { ServerConfigService } from '@pega/angular-sdk-library';
import { getSdkComponentMap } from '@pega/angular-sdk-library';
import localSdkComponentMap from '../../../../../sdk-local-component-map';

declare global {
  interface Window {
      PCore: {
          onPCoreReady: Function;
          createPConnect: Function;
          getComponentsRegistry: Function;
          checkIfSemanticURL: Function;
          isValidSemanticURL: Function;
          getConstants(): any;
          setBehaviorOverrides: Function;
          getAttachmentUtils: Function;
          getDataApiUtils: Function;
          getAssetLoader: Function;
          getEnvironmentInfo: Function;
          getPubSubUtils(): any;
          getUserApi(): any;
          getAuthUtils(): any;
          registerComponentCreator(c11nPropObject: any): Function;
          getMessageManager: Function;
          getLocaleUtils: any;
          setBehaviorOverride: Function;
          populateAdditionalProps: Function;
          getStore: Function;
      };
      myLoadPortal: Function;
      myLoadDefaultPortal: Function;
  }
}

@Component({
  selector: 'app-top-app-mashup',
  templateUrl: './top-app-mashup.component.html',
  styleUrls: ['./top-app-mashup.component.scss'],
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, RootContainerComponent]
})
export class TopAppMashupComponent implements OnInit {
  PCore$: any;
  pConn$: any;
  props$: any;

  sComponentName$: string;
  arChildren$: Array<any>;
  bPCoreReady$: boolean = false;

  store: any;

  bLoggedIn$: boolean = false;
  bPConnectLoaded$: boolean = false;
  isProgress$: boolean = false;

  progressSpinnerSubscription: Subscription;
  resetPConnectSubscription: Subscription;

  spinnerTimer: any;

  portalSelectionScreen: boolean = false;
  availablePortals: Array<string>;
  defaultPortalName: string;

  constructor(
    private psservice: ProgressSpinnerService,
    private ngZone: NgZone,
    private scservice: ServerConfigService
  ) {}

  ngOnInit() {
    this.scservice.readSdkConfig().then(() => {
      this.initialize();
    });
  }

  ngOnDestroy() {
    this.progressSpinnerSubscription.unsubscribe();
    this.resetPConnectSubscription.unsubscribe();
  }

  initialize() {
    // handle showing and hiding the progress spinner
    this.progressSpinnerSubscription = this.psservice.getMessage().subscribe((message) => {
      this.showHideProgress(message.show);
    });

    // Add event listener for when logged in and constellation bootstrap is loaded
    document.addEventListener('SdkConstellationReady', () => {
      this.bLoggedIn$ = true;
      // start the portal
      this.startPortal();
    });

    // Add event listener for when logged out
    document.addEventListener('SdkLoggedOut', () => {
      this.bLoggedIn$ = false;
    });

    /* Login if needed */
    const sAppName = location.pathname.substring(location.pathname.indexOf('/') + 1);
    loginIfNecessary({appName: sAppName, mainRedirect: true});
  }

  startPortal() {
    window.PCore.onPCoreReady((renderObj) => {
      // Check that we're seeing the PCore version we expect
      compareSdkPCoreVersions();

      // Initialize the SdkComponentMap (local and pega-provided)
      getSdkComponentMap(localSdkComponentMap).then((theComponentMap: any) => {
        console.log(`SdkComponentMap initialized`, theComponentMap);

        // Don't call initialRender until SdkComponentMap is fully initialized
        this.initialRender(renderObj);
      });
    });

    const { appPortal: thePortal, excludePortals } = this.scservice.getSdkConfigServer();
    const defaultPortal = window.PCore?.getEnvironmentInfo?.().getDefaultPortal?.();
    // Note: myLoadPortal and myLoadDefaultPortal are set when bootstrapWithAuthHeader is invoked
    if (thePortal) {
      console.log(`Loading specified appPortal: ${thePortal}`);
      window.myLoadPortal('app-root', thePortal, []); // this is defined in bootstrap shell that's been loaded already
    } else if (window.myLoadDefaultPortal && defaultPortal && !excludePortals.includes(defaultPortal)) {
      console.log(`Loading default portal: ${defaultPortal}`);
      window.myLoadDefaultPortal('app-root', []);
    } else {
      console.log('Loading portal selection screen');
      this.portalSelectionScreen = true;
      this.defaultPortalName = defaultPortal;
      // Getting current user's access group's available portals list other than exluded portals (relies on Traditional DX APIs)
      getAvailablePortals().then((portals: Array<string>) => {
        this.availablePortals = portals;
      });
    }
  }

  initialRender(renderObj) {
    /* In react initialRender happens here */

    // Need to register the callback function for PCore.registerComponentCreator
    // This callback is invoked if/when you call a PConnect createComponent
    window.PCore.registerComponentCreator((c11nEnv, additionalProps = {}) => {
      // experiment with returning a PConnect that has deferenced the
      // referenced View if the c11n is a 'reference' component
      const compType = c11nEnv.getPConnect().getComponentName();
      // console.log( `top-app-mashup: startPortal - registerComponentCreator c11nEnv type: ${compType}`);

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
      this.props$ = props;
      this.pConn$ = this.props$.getPConnect();
      this.sComponentName$ = this.pConn$.getComponentName();
      this.PCore$ = window.PCore;
      this.arChildren$ = this.pConn$.getChildren();
      this.bPCoreReady$ = true;
    });
  }

  showHideProgress(bShow: boolean) {
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
    } else {
      if (this.spinnerTimer != null) {
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

  logOff() {
    logout().then(() => {
      // Reload the page to kick off the login
      window.location.reload();
    });
  }

  loadSelectedPortal(portal) {
    this.portalSelectionScreen = false;
    window.myLoadPortal('app-root', portal, []); // this is defined in bootstrap shell that's been loaded already
  }
}
