import { Component, OnInit, Input } from '@angular/core';
import { Utils } from "../../../_helpers/utils";
import { AngularPConnectService } from "../../../_bridge/angular-pconnect";
import { interval } from "rxjs/internal/observable/interval";

// import * as moment from "moment";

@Component({
  selector: 'app-text-content',
  templateUrl: './text-content.component.html',
  styleUrls: ['./text-content.component.scss']
})
export class TextContentComponent implements OnInit {
  @Input() pConn$: any;

  configProps$ : Object;

  content$: string = "";
  displayAs$: string;

  // Used with AngularPConnect
  angularPConnectData: any = {};
  

  constructor( private angularPConnect: AngularPConnectService, 
               private utils: Utils ) {

   }

   ngOnInit(): void {

    // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);

    // Then, continue on with other initialization

    // call updateSelf when initializing
    //this.updateSelf();
    this.checkAndUpdate();

    
  }

  ngOnDestroy(): void {

    if (this.angularPConnectData.unsubscribeFn) {
      this.angularPConnectData.unsubscribeFn();
    }
  } 




  // updateSelf
  updateSelf(): void {
    // moved this from ngOnInit() and call this from there instead...
    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());
    if (this.configProps$["content"] != undefined) {
      this.content$ = this.configProps$["content"];
    }
    if (this.configProps$["displayAs"] != undefined) {
      this.displayAs$ = this.configProps$["displayAs"];
    }

    // Any update to content or displayAs will re-render this component.
    //  All rendering logic is in the .html file.

  }

  // Callback passed when subscribing to store change
  onStateChange() {
    this.checkAndUpdate();
  }

  checkAndUpdate() {
    // Should always check the bridge to see if the component should
    // update itself (re-render)
    const bUpdateSelf = this.angularPConnect.shouldComponentUpdate( this );
  
    // ONLY call updateSelf when the component should update
    if (bUpdateSelf) {
      this.updateSelf();
    }
  }

}
