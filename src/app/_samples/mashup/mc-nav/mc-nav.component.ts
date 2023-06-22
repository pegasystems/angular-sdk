import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription, interval } from 'rxjs';

import { ProgressSpinnerService } from '../../../_messages/progress-spinner.service';
import { ResetPConnectService } from '../../../_messages/reset-pconnect.service';
import { UpdateWorklistService } from '../../../_messages/update-worklist.service';
import { AuthService } from '../../../_services/auth.service';
import { endpoints } from '../../../_services/endpoints';
import { ServerConfigService } from '../../../_services/server-config.service';
import { Utils } from '../../../_helpers/utils';
import { compareSdkPCoreVersions } from '../../../_helpers/versionHelpers';
import { MainScreenComponent } from '../main-screen/main-screen.component';

import { getSdkComponentMap } from '@pega/angular-sdk-components/lib/src/app/_bridge/helpers/sdk_component_map';
import localSdkComponentMap from '../../../../sdk-local-component-map';

declare global {
  interface Window {
    myLoadMashup: Function;
  }
}

@Component({
  selector: 'app-mc-nav',
  templateUrl: './mc-nav.component.html',
  styleUrls: ['./mc-nav.component.scss'],
  providers: [Utils],
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MainScreenComponent
  ]
})
export class MCNavComponent implements OnInit {
  starterPackVersion$: string = endpoints.SP_VERSION;
  PCore$: any;
  pConn$: any;

  bLoggedIn$: boolean = false;
  bPConnectLoaded$: boolean = false;
  bHasPConnect$: boolean = false;
  isProgress$: boolean = false;

  progressSpinnerSubscription: Subscription;
  resetPConnectSubscription: Subscription;

  bootstrapShell: any;

  constructor(
    private aService: AuthService,
    private cdRef: ChangeDetectorRef,
    private psservice: ProgressSpinnerService,
    private rpcservice: ResetPConnectService,
    private uwservice: UpdateWorklistService,
    private titleService: Title,
    private scservice: ServerConfigService
  ) {}

  ngOnInit() {
    this.scservice.getServerConfig().then(() => {
      this.initialize();
    });
  }

  ngOnDestroy() {
    this.progressSpinnerSubscription.unsubscribe();
    this.resetPConnectSubscription.unsubscribe();
  }

  initialize() {
    if (!this.PCore$) {
      this.PCore$ = window.PCore;
    }

    this.titleService.setTitle('Media Co');

    sessionStorage.clear();

    // handle showing and hiding the progress spinner
    this.progressSpinnerSubscription = this.psservice.getMessage().subscribe((message) => {
      this.showHideProgress(message.show);
    });

    this.resetPConnectSubscription = this.rpcservice.getMessage().subscribe((message) => {
      if (message.reset) {
        this.bPConnectLoaded$ = false;

        ///window.PCore = null;

        let timer = interval(1000).subscribe(() => {
          //this.getPConnectAndUpdate();
          window.myLoadMashup('app-root', false);

          // update the worklist
          this.uwservice.sendMessage(true);

          timer.unsubscribe();
        });
      }
    });

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

    const sdkConfigAuth = this.scservice.getSdkConfigAuth();

    if (!sdkConfigAuth.mashupClientId && sdkConfigAuth.customAuthType === 'Basic') {
      // Service package to use custom auth with Basic
      const sB64 = window.btoa(`${sdkConfigAuth.mashupUserIdentifier}:${window.atob(sdkConfigAuth.mashupPassword)}`);
      this.aService.setAuthHeader(`Basic ${sB64}`);
    }

    if (!sdkConfigAuth.mashupClientId && sdkConfigAuth.customAuthType === 'BasicTO') {
      const now = new Date();
      const expTime = new Date(now.getTime() + 5 * 60 * 1000);
      let sISOTime = `${expTime.toISOString().split('.')[0]}Z`;
      const regex = /[-:]/g;
      sISOTime = sISOTime.replace(regex, '');
      // Service package to use custom auth with Basic
      const sB64 = window.btoa(
        `${sdkConfigAuth.mashupUserIdentifier}:${window.atob(sdkConfigAuth.mashupPassword)}:${sISOTime}`
      );
      this.aService.setAuthHeader(`Basic ${sB64}`);
    }

    // Login if needed, without doing an initial main window redirect
    const sAppName = location.pathname.substring(location.pathname.indexOf('/') + 1);
    this.aService.loginIfNecessary(sAppName, true);
  }

  startMashup() {
    if (!this.PCore$) {
      this.PCore$ = window.PCore;
    }

    this.PCore$.onPCoreReady((renderObj) => {
      // Check that we're seeing the PCore version we expect
      compareSdkPCoreVersions();

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
    // Need to register the callback function for PCore.registerComponentCreator
    //  This callback is invoked if/when you call a PConnect createComponent
    this.PCore$.registerComponentCreator((c11nEnv, additionalProps = {}) => {
      // debugger;

      // experiment with returning a PConnect that has deferenced the
      //  referenced View if the c11n is a 'reference' component
      const compType = c11nEnv.getPConnect().getComponentName();
      // console.log( `mc-nav - registerComponentCreator c11nEnv type: ${compType}`);

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

    this.pConn$ = props.getPConnect();

    this.bHasPConnect$ = true;
    this.bPConnectLoaded$ = true;

    this.showHideProgress(false);

    sessionStorage.setItem('pCoreUsage', 'AngularSDKMashup');
  }

  showHideProgress(bShow: boolean) {
    this.isProgress$ = bShow;
    this.cdRef.detectChanges();
  }

  logOff() {
    this.aService.logout().then(() => {
      // Reload the page to kick off the login
      window.location.reload();
    });
  }
}
