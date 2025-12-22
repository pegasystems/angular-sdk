import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { getSdkConfig, loginIfNecessary } from '@pega/auth/lib/sdk-auth-manager';

import { ProgressSpinnerService, Utils, compareSdkPCoreVersions, getSdkComponentMap } from '@pega/angular-sdk-components';

import { HeaderComponent } from './header/header.component';
import { MainScreenComponent } from './main-screen/main-screen.component';
import localSdkComponentMap from '../../../../sdk-local-component-map';
import { initializeAuthentication } from './utils';

declare global {
  interface Window {
    myLoadMashup: Function;
  }
}

@Component({
  selector: 'app-embedded',
  templateUrl: './embedded.component.html',
  styleUrls: ['./embedded.component.scss'],
  providers: [Utils],
  imports: [CommonModule, MatProgressSpinnerModule, MatToolbarModule, MatIconModule, MatButtonModule, HeaderComponent, MainScreenComponent]
})
export class EmbeddedComponent implements OnInit, OnDestroy {
  pConn$: typeof PConnect;

  bLoggedIn$ = false;
  bHasPConnect$ = false;
  isProgress$ = false;

  progressSpinnerSubscription: Subscription;

  bootstrapShell: any;

  constructor(
    private psservice: ProgressSpinnerService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.initialize();

    // handle showing and hiding the progress spinner
    this.progressSpinnerSubscription = this.psservice.getMessage().subscribe(message => {
      this.showHideProgress(message.show);
    });
  }

  ngOnDestroy() {
    this.progressSpinnerSubscription.unsubscribe();
  }

  async initialize() {
    // Add event listener for when logged in and constellation bootstrap is loaded
    document.addEventListener('SdkConstellationReady', () => this.handleSdkConstellationReady());

    const { authConfig, theme } = await getSdkConfig();
    document.body.classList.remove(...['light', 'dark']);
    document.body.classList.add(theme || 'light');

    initializeAuthentication(authConfig);

    // Login if needed, without doing an initial main window redirect
    const sAppName = window.location.pathname.substring(window.location.pathname.indexOf('/') + 1);
    loginIfNecessary({ appName: sAppName, mainRedirect: false });
  }

  handleSdkConstellationReady() {
    this.bLoggedIn$ = true;
    // start the portal
    this.startMashup();
  }

  startMashup() {
    PCore.onPCoreReady(async renderObj => {
      console.log('PCore ready!');

      // Check that we're seeing the PCore version we expect
      compareSdkPCoreVersions();

      // Initialize the SdkComponentMap (local and pega-provided)
      await getSdkComponentMap(localSdkComponentMap);
      console.log(`SdkComponentMap initialized`);

      // Don't call initialRender until SdkComponentMap is fully initialized
      this.initialRender(renderObj);
    });

    window.myLoadMashup('app-root', false); // this is defined in bootstrap shell that's been loaded already
  }

  initialRender(renderObj) {
    // Need to register the callback function for PCore.registerComponentCreator
    // This callback is invoked if/when you call a PConnect createComponent
    PCore.registerComponentCreator(c11nEnv => {
      return c11nEnv;
    });

    // Change to reflect new use of arg in the callback:
    const { props } = renderObj;

    this.ngZone.run(() => {
      this.pConn$ = props.getPConnect();
      this.bHasPConnect$ = true;
      this.showHideProgress(false);
    });
  }

  showHideProgress(bShow: boolean) {
    this.isProgress$ = bShow;
  }
}
