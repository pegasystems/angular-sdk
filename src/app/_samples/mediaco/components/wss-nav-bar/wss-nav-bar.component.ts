import { Component, forwardRef, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AngularPConnectData, AngularPConnectService, ComponentMapperComponent } from '@pega/angular-sdk-components';
import { logout } from '@pega/auth/lib/sdk-auth-manager';
import { Utils } from '@pega/angular-sdk-components';
import { FooterComponent } from 'src/app/_samples/mediaco/components/footer/footer.component';

@Component({
  selector: 'app-wss-nav-bar',
  templateUrl: './wss-nav-bar.component.html',
  styleUrls: ['./wss-nav-bar.component.scss'],
  providers: [Utils],
  imports: [
    CommonModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatMenuModule,
    FooterComponent,
    forwardRef(() => ComponentMapperComponent)
  ]
})
export class WssNavBarComponent implements OnInit, OnDestroy {
  @Input() pConn$: typeof PConnect;
  @Input() appName$: string;
  @Input() pages$: any[];
  @Input() caseTypes$: any[];
  @Input() homePage: any;
  @Input() arChildren$: any[];
  @Input() portalLogoImage$: string;

  // For interaction with AngularPConnect
  angularPConnectData: AngularPConnectData = {};

  navPages$: any[];
  navExpandCollapse$: string;
  bShowCaseTypes$ = false;

  portalOperator$: string | undefined;
  portalOperatorInitials$: string;

  actionsAPI: any;
  createWork: any;
  showPage: any;
  logout: any;

  navIcon$: string;
  localizedVal = PCore.getLocaleUtils().getLocaleValue;
  localeCategory = 'AppShell';
  collapsed = true;
  activePage = 'Self-service Main page';

  constructor(
    private angularPConnect: AngularPConnectService,
    private ngZone: NgZone,
    private utils: Utils
  ) {}

  ngOnInit(): void {
    // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);

    this.navIcon$ = this.utils.getSDKStaticContentUrl().concat('assets/pzpega-logo-mark.svg');

    // this is a dummy "get", because right now images are in http and the main screen is https
    // so the images don't load automatically.  This call, makes an initial hit that allows the
    // rest of the images to show up
    this.loadImage(this.navIcon$);

    this.initComponent();
  }

  // ngOnDestroy
  //  unsubscribe from Store
  ngOnDestroy(): void {
    if (this.angularPConnectData.unsubscribeFn) {
      this.angularPConnectData.unsubscribeFn();
    }
  }

  loadImage(src: string) {
    return new Promise(resolve => {
      resolve(src);
    });
  }

  // Callback passed when subscribing to store change
  onStateChange() {
    // Should always check the bridge to see if the component should update itself (re-render)
    const bUpdateSelf = this.angularPConnect.shouldComponentUpdate(this);

    // NOTE: can call angularPConnect.getState with optional args for detailed logging: bLogMsg and component object
    this.angularPConnect.getState();

    if (bUpdateSelf) {
      this.updateSelf();
    }
  }

  updateSelf(): void {
    this.initComponent();
  }

  initComponent() {
    this.ngZone.run(() => {
      this.navIcon$ = this.utils.getSDKStaticContentUrl().concat('assets/pzpega-logo-mark.svg');
      this.navExpandCollapse$ = this.utils.getImageSrc('plus', this.utils.getSDKStaticContentUrl());

      // Then, continue on with other initialization

      // making a copy, so can add info
      this.navPages$ = JSON.parse(JSON.stringify(this.pages$));

      this.actionsAPI = this.pConn$.getActionsApi();
      this.createWork = this.actionsAPI.createWork.bind(this.actionsAPI);
      this.showPage = this.actionsAPI.showPage.bind(this.actionsAPI);
      this.logout = this.actionsAPI.logout.bind(this.actionsAPI);

      this.portalOperator$ = PCore.getEnvironmentInfo().getOperatorName();
      this.portalOperatorInitials$ = this.utils.getInitials(this.portalOperator$ ?? '');
    });
  }

  navPanelButtonClick(oPageData: any) {
    const { pyClassName, pyRuleName, pyLabel } = oPageData;

    this.activePage = pyLabel;

    this.showPage(pyRuleName, pyClassName);
  }

  toggleMenu() {
    this.collapsed = !this.collapsed;
  }

  navPanelLogoutClick() {
    logout().then(() => {
      // Reload the page to kick off the login
      window.location.reload();
    });
  }
}
