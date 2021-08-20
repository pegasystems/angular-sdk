import { Component, OnInit, Input } from '@angular/core';
import { AngularPConnectService } from "../../_bridge/angular-pconnect";
import { ChangeDetectorRef } from "@angular/core";
import { Subscription, Observable } from 'rxjs';
import { interval } from "rxjs/internal/observable/interval";
import { ProgressSpinnerService } from "../../_messages/progress-spinner.service";
import { NgZone } from '@angular/core';
import { Utils} from '../../_helpers/utils';

//
// WARNING:  It is not expected that this file should be modified.  It is part of infrastructure code that works with 
// Redux and creation/update of Redux containers and PConnect.  Modifying this code could have undesireable results and
// is totally at your own risk.
//

@Component({
  selector: 'app-root-container',
  templateUrl: './root-container.component.html',
  styleUrls: ['./root-container.component.scss']
})
export class RootContainerComponent implements OnInit {

  @Input() pConn$: any;
  @Input() props$: any;
  @Input() PCore$: any;
  @Input() displayOnlyFA$: boolean;
  @Input() isMashup$: boolean;

  componentName$: string = "";
  bIsProgress$: boolean = false;

  // preview and modalview pConn
  pvConn$: any = null;
  mConn$: any = null;

  bShowRoot$: boolean = true;

  // init, modal will change value when it displays
  bModalVisible$: boolean = false;

  progressSpinnerMessage: any;
  progressSpinnerSubscription: Subscription;
  spinnerTimer: any = null;

  // For interaction with AngularPConnect
  angularPConnectData: any = {};

  constructor(private angularPConnect: AngularPConnectService,
              private psService: ProgressSpinnerService,
              private ngZone: NgZone,
              private utils: Utils,
              private cdRef: ChangeDetectorRef ) { }

  ngOnInit(): void {
    
    let myContext = "app";
    if (this.isMashup$) {
      myContext = "root";
    }

    const options = { "context": myContext };


    if (!this.PCore$) {
      this.PCore$ = window.PCore;
    }

    const { containers } = this.PCore$.getStore().getState();
    const items = Object.keys(containers).filter((item) =>
      item.includes("root")
    );
    
    this.PCore$.getContainerItems().addContainerItems(items);

    // add preview and modalview containers to redux
    // keep local copies of the the pConnect that is related
 
    const configObjPreview = this.PCore$.createPConnect({
      meta: {
        type: "PreviewViewContainer",
        config: {
          name: "preview"
        }
      },
      options
    });

    this.pvConn$ = configObjPreview.getPConnect();

    const configObjModal = this.PCore$.createPConnect({
      meta: {
        "type": "ModalViewContainer",
        "config": {
          "name": "modal"
        }
      },
      options: {
        "pageReference": "pyPortal",
        "context": myContext
      }
    });


    // clear out hasViewContainer
    sessionStorage.setItem("hasViewContainer", "false");

    this.mConn$ = configObjModal.getPConnect();

    // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);

    // handle showing and hiding the progress spinner
    this.progressSpinnerSubscription = this.psService.getMessage().subscribe(message => { 
      this.progressSpinnerMessage = message;

      this.showHideProgress(this.progressSpinnerMessage.show);
    });

  }



  ngOnDestroy() {

    //this.storeUnsubscribe();
    if (this.angularPConnectData.unsubscribeFn) {
      this.angularPConnectData.unsubscribeFn();
    }

  }


  // Callback passed when subscribing to store change
  onStateChange() {
    // Should always check the bridge to see if the component should update itself (re-render)
    const bUpdateSelf = this.angularPConnect.shouldComponentUpdate( this );

    if (bUpdateSelf){
      this.updateSelf();
    }


  }


  modalVisibleChanged(isVisible) {
    if (this.displayOnlyFA$) {
      if (isVisible) {
        this.bShowRoot$ = false;
      }
      else {
        this.bShowRoot$ = true;
      }
    }
  }


  updateSelf() {

    // need to call this.getCurrentCompleteProps (not this.thePConn.getConfigProps) 
    //  to get full set of props that affect this component in Redux
    const myProps: any = this.angularPConnect.getCurrentCompleteProps(this);

    const renderingModes = ["portal", "view"];
    const noPortalMode = "noPortal";

    let myContext = "app";
    if (this.isMashup$) {
      myContext = "root";
    }

    const options = { "context": myContext };
    const {
      renderingMode,
      children,
      skeleton,
      httpMessages,
      routingInfo
    } = myProps;


    if (routingInfo && renderingModes.includes(renderingMode)) {
      const { accessedOrder, items } = routingInfo;
      if (accessedOrder && items) {
        // bootstrap loadPortal resolves to here
        const key = accessedOrder[accessedOrder.length - 1];
        if (
          items[key] &&
          items[key].view &&
          Object.keys(items[key].view).length > 0
        ) {
          const itemView = items[key].view;

          const rootObject: any = this.PCore$.createPConnect({
            meta: itemView,
            options: {
              context: items[key].context
            }
          });
    
          setTimeout(() => {
            // makes sure Angular tracks these changes
            this.ngZone.run(() => {
              this.pConn$ = rootObject.getPConnect();
              this.componentName$ = this.pConn$.getComponentName();
            });
          });

        }
      }
  
    } else if (renderingMode == noPortalMode) { 
      // bootstrap loadMashup resolves to here

      let arChildren = this.pConn$.getChildren()
      if (arChildren && arChildren.length == 1) {

        // have to have a quick timeout or get an "expressions changed" angular error
        setTimeout(() => {
          this.ngZone.run(() => {
            let localPConn = arChildren[0].getPConnect();
            this.componentName$ = localPConn.getComponentName();
            this.bShowRoot$ = true;
          });
        })

      }

    
    } else if (children && children.length > 0) {
      // haven't resolved to here

    } else if (skeleton !== undefined) {
      // TODO: need to update once skeletons are available;

    } else {

    }
  } 


  showHideProgress(bShow: boolean) {

    // only show spinner after 500ms wait, so if server fast, won't see
    if (bShow) {

      if (!this.bIsProgress$) {
        // makes sure Angular tracks these changes
        if (!this.spinnerTimer || this.spinnerTimer.isStopped) {
          this.spinnerTimer = interval(500).subscribe(() => {
            try {
              this.spinnerTimer.unsubscribe();
            }
            catch (ex) {
  
            }
  
            this.ngZone.run(() => {
              this.bIsProgress$ = true;
            });
  
          });
        }


      }

    }
    else {
      if (this.spinnerTimer && !this.spinnerTimer.isStopped) {
        this.spinnerTimer.unsubscribe();
      }

      // don't touch bIsProgress$ unless differnent
      if (bShow != this.bIsProgress$) {
        // makes sure Angular tracks these changes
        this.ngZone.run(() => {
          this.bIsProgress$ = bShow;
        });
      }


    }



  }

}
