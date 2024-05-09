import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  ResetPConnectService,
  ServerConfigService,
  compareSdkPCoreVersions,
  getSdkComponentMap,
  ComponentMapperComponent
} from '@pega/angular-sdk-components';
import localSdkComponentMap from '../../../../../sdk-local-component-map';
import { loginIfNecessary, logout, sdkSetAuthHeader } from '@pega/auth/lib/sdk-auth-manager';
import { Subscription, interval } from 'rxjs';
import { LandingContentComponent } from '../landing-content/landing-content.component';
import { LandingFooterComponent } from '../landing-footer/landing-footer.component';
import { LandingHeaderComponent } from '../landing-header/landing-header.component';

declare let require: any;

const default_site = require('../../site-config/default_settings.json');

// const endpoints = require('../../../../sdk-config.json');

if (!localStorage.getItem('site')) {
  localStorage.setItem('site', JSON.stringify(default_site));
}

@Component({
  selector: 'app-landing-toplevel',
  templateUrl: './landing-toplevel.component.html',
  styleUrls: ['./landing-toplevel.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    ComponentMapperComponent,
    LandingContentComponent,
    LandingFooterComponent,
    LandingHeaderComponent
  ]
})
export class LandingToplevelComponent implements OnInit, OnDestroy {
  pConn$: typeof PConnect;

  bLoggedIn$ = false;
  bPConnectLoaded$ = false;
  bHasPConnect$ = false;
  isProgress$ = false;
  showPega$ = false;
  resetPConnectSubscription: Subscription;
  caseTypes: any;

  constructor(
    private scservice: ServerConfigService,
    private rpcservice: ResetPConnectService
  ) {}

  storage = JSON.parse(`${localStorage.getItem('site')}`);
  i18n = this.storage.i18n.find(x => x.locale === this.storage.currentLocale);
  ngOnInit(): void {
    console.log('Hi', this.i18n);
    this.scservice.readSdkConfig().then(() => {
      this.initialize();
    });
  }

  ngOnDestroy() {
    // this.progressSpinnerSubscription.unsubscribe();
    this.resetPConnectSubscription.unsubscribe();
  }

  async initialize() {
    sessionStorage.clear();

    // handle showing and hiding the progress spinner
    // this.progressSpinnerSubscription = this.psservice.getMessage().subscribe(message => {
    //   this.showHideProgress(message.show);
    // });

    this.resetPConnectSubscription = this.rpcservice.getMessage().subscribe(message => {
      if (message.reset) {
        this.bPConnectLoaded$ = false;

        const timer = interval(1000).subscribe(() => {
          // this.getPConnectAndUpdate();
          window.myLoadMashup('app-root', false);

          // update the worklist
          // this.uwservice.sendMessage(true);

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

    const sdkConfigAuth = await this.scservice.getSdkConfigAuth();

    if (!sdkConfigAuth.mashupClientId && sdkConfigAuth.customAuthType === 'Basic') {
      // Service package to use custom auth with Basic
      const sB64 = window.btoa(`${sdkConfigAuth.mashupUserIdentifier}:${window.atob(sdkConfigAuth.mashupPassword)}`);
      sdkSetAuthHeader(`Basic ${sB64}`);
    }

    if (!sdkConfigAuth.mashupClientId && sdkConfigAuth.customAuthType === 'BasicTO') {
      const now = new Date();
      const expTime = new Date(now.getTime() + 5 * 60 * 1000);
      let sISOTime = `${expTime.toISOString().split('.')[0]}Z`;
      const regex = /[-:]/g;
      sISOTime = sISOTime.replace(regex, '');
      // Service package to use custom auth with Basic
      const sB64 = window.btoa(`${sdkConfigAuth.mashupUserIdentifier}:${window.atob(sdkConfigAuth.mashupPassword)}:${sISOTime}`);
      sdkSetAuthHeader(`Basic ${sB64}`);
    }

    // Login if needed, without doing an initial main window redirect
    // eslint-disable-next-line no-restricted-globals
    const sAppName = location.pathname.substring(location.pathname.indexOf('/') + 1);
    loginIfNecessary({ appName: sAppName, mainRedirect: false });
  }

  startMashup() {
    PCore.onPCoreReady(renderObj => {
      console.log('PCore ready!');
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
    PCore.registerComponentCreator(c11nEnv => {
      // debugger;

      // experiment with returning a PConnect that has deferenced the
      //  referenced View if the c11n is a 'reference' component
      // const compType = c11nEnv.getPConnect().getComponentName();
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
    sessionStorage.setItem('pCoreUsage', 'AngularSDKMashup');
    this.getCaseList();
  }

  getCaseList() {
    this.caseTypes = PCore.getEnvironmentInfo().environmentInfoObject.pyCaseTypeList;
    console.log('this.caseTypes', this.caseTypes);
  }

  createWork() {
    // this.showTriplePlayOptions$ = false;
    this.showPega$ = true;

    this.scservice.getSdkConfig().then(sdkConfig => {
      let mashupCaseType = sdkConfig.serverConfig.appMashupCaseType;
      if (!mashupCaseType) {
        const caseTypes = PCore.getEnvironmentInfo().environmentInfoObject.pyCaseTypeList;
        mashupCaseType = caseTypes[0].pyWorkTypeImplementationClassName;
      }

      // const options: any = {
      //   pageName: 'pyEmbedAssignment',
      //   startingFields:
      //     mashupCaseType === 'DIXL-MediaCo-Work-NewService'
      //       ? {
      //           Package: sLevel
      //         }
      //       : {}
      // };
      const options: any = {
        pageName: 'pyEmbedAssignment',
        startingFields: {}
      };
      (PCore.getMashupApi().createCase(mashupCaseType, PCore.getConstants().APP.APP, options) as Promise<any>).then(() => {
        console.log('createCase rendering is complete');
      });
    });
  }

  createCase(caseType) {
    console.log('caseType', caseType);
    this.showPega$ = true;
    const options: any = {
      pageName: 'pyEmbedAssignment',
      startingFields: {}
    };
    (PCore.getMashupApi().createCase(caseType.pyWorkTypeImplementationClassName, PCore.getConstants().APP.APP, options) as Promise<any>).then(() => {
      console.log('createCase rendering is complete');
    });
  }

  logOff() {
    logout().then(() => {
      // Reload the page to kick off the login
      window.location.reload();
    });
  }
}
