import { Component, OnInit, Input } from '@angular/core';
import { ChangeDetectorRef } from "@angular/core";
import { AngularPConnectService } from "../../_bridge/angular-pconnect"
import { ProgressSpinnerService } from "../../_messages/progress-spinner.service";
import { GetLoginStatusService } from "../../_messages/get-login-status.service";
import { interval } from "rxjs/internal/observable/interval";
import { Utils } from "../../_helpers/utils";
import { NgZone } from '@angular/core';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [Utils]
})

export class NavbarComponent implements OnInit {

  @Input() pConn$: any;
  @Input() appName$: string;
  @Input() pages$: Array<any>;
  @Input() caseTypes$: Array<any>;

  navPages$: Array<any>;
  navExpandCollapse$: string;
  bShowCaseTypes$: boolean = false;

  portalName$: string = "User Portal";
  portalApp$: string = "";
  portalLogoImage$: string;

  portalOperator$: string;
  portalOperatorInitials$: string;

  actionsAPI: any;
  createWork: any;
  showPage: any;
  logout:any;
  
  configProps: any;
  navIcon$: string;

  // For interaction with AngularPConnect
  angularPConnectData: any = {};

  PCore$: any;


  constructor(private angularPConnect: AngularPConnectService, 
              private chRef: ChangeDetectorRef,
              private psService: ProgressSpinnerService,
              private glsservice: GetLoginStatusService,
              private ngZone: NgZone,
              private utils: Utils) {

   }


  ngOnInit(): void {

    if (!this.PCore$) {
      this.PCore$ = window.PCore;
    }

    // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);


    this.navIcon$ = this.PCore$.getAssetLoader().getStaticServerUrl().concat("assets/pzpega-logo-mark.svg");
    
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
    return new Promise((resolve, reject) => {
      resolve(src);
    });
  }

  // Callback passed when subscribing to store change
  onStateChange() {
    // Should always check the bridge to see if the component should update itself (re-render)
    const bUpdateSelf = this.angularPConnect.shouldComponentUpdate( this );

    // NOTE: can call angularPConnect.getState with optional args for detailed logging: bLogMsg and component object
    this.angularPConnect.getState();

    if (bUpdateSelf) {
      this.updateSelf();
    }

  }

  updateSelf(): void  {
    this.initComponent();
  }


  initComponent() {


    this.ngZone.run( () => {
      this.navIcon$ = this.PCore$.getAssetLoader().getStaticServerUrl().concat("assets/pzpega-logo-mark.svg");
      this.navExpandCollapse$ = this.utils.getImageSrc("plus", this.PCore$.getAssetLoader().getStaticServerUrl());

  
      // Then, continue on with other initialization
  
      // making a copy, so can add info
      this.navPages$ = JSON.parse(JSON.stringify(this.pages$));
  
  
      for (let page in this.navPages$) {
        this.navPages$[page]["iconName"] = this.utils.getImageSrc(this.navPages$[page]["pxPageViewIcon"], this.PCore$.getAssetLoader().getStaticServerUrl());
      }
  
  
      this.actionsAPI = this.pConn$.getActionsApi();
      this.createWork = this.actionsAPI.createWork.bind(this.actionsAPI);
      this.showPage = this.actionsAPI.showPage.bind(this.actionsAPI);
      this.configProps = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());
      this.logout = this.actionsAPI.logout.bind(this.actionsAPI);
  
      let oData = this.pConn$.getDataObject();
  
      this.portalLogoImage$ = this.PCore$.getAssetLoader().getStaticServerUrl().concat("assets/pzpega-logo-mark.svg");
      this.portalOperator$ = this.PCore$.getEnvironmentInfo().getOperatorName();
      this.portalOperatorInitials$ = this.utils.getInitials(this.portalOperator$);
  
      this.portalApp$ = this.configProps["appName"];
    });
   
  }


  navPanelButtonClick(oPageData: any) {

    const { pyClassName, pyRuleName } = oPageData;

    this.showPage(pyRuleName, pyClassName);

  }


  navPanelCreateButtonClick() {

    if (this.navExpandCollapse$.indexOf("plus") > 0) {
     this.navExpandCollapse$ = this.utils.getImageSrc("times", this.PCore$.getAssetLoader().getStaticServerUrl());
     this.bShowCaseTypes$ = true;
    }
    else {
      this.navExpandCollapse$ = this.utils.getImageSrc("plus", this.PCore$.getAssetLoader().getStaticServerUrl());
      this.bShowCaseTypes$ = false;
    }

    this.chRef.detectChanges();

  }

  navPanelCreateCaseType(sCaseType: string, sFlowType: string) {

    const actionInfo = {
      containerName: "primary",
      flowType: sFlowType ? sFlowType : "pyStartCase"
    };

    this.psService.sendMessage(true);
  
    this.createWork(sCaseType, actionInfo);

    let timer = interval(100).subscribe(() => {
      this.navPanelCreateButtonClick();

      timer.unsubscribe();
      });
    

  }

  navPanelLogoutClick() {

    this.glsservice.sendMessage("LoggedOut");

  }





}