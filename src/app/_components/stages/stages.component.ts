import { Component, OnInit, Input } from '@angular/core';
import { AngularPConnectService } from "../../_bridge/angular-pconnect";
import { interval } from "rxjs/internal/observable/interval";
import { Utils } from "../../_helpers/utils";

@Component({
  selector: 'app-stages',
  templateUrl: './stages.component.html',
  styleUrls: ['./stages.component.scss']
})
export class StagesComponent implements OnInit {


  @Input() pConn$: any;

  configProps$ : Object;

  arStageResults$: Array<any>;
  lastStage$: any;

  checkSvgIcon$: string;

  PCore$: any;

  // Used with AngularPConnect
  angularPConnectData: any = {};

  constructor(private angularPConnect: AngularPConnectService,
              private utils: Utils) { }

  ngOnInit(): void {

    if (!this.PCore$) {
      this.PCore$ = window.PCore;
    }

    // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);

    const imagePath = this.utils.getIconPath(this.PCore$.getAssetLoader().getStaticServerUrl());
    this.checkSvgIcon$ = this.utils.getImageSrc("check", this.PCore$.getAssetLoader().getStaticServerUrl());



  }


  ngOnDestroy(): void {

    if (this.angularPConnectData.unsubscribeFn) {
      this.angularPConnectData.unsubscribeFn();
    }
  } 

  // Callback passed when subscribing to store change
  onStateChange() {
    // Should always check the bridge to see if the component should
    // update itself (re-render)
    const bUpdateSelf = this.angularPConnect.shouldComponentUpdate( this );
  
    // ONLY call updateSelf when the component should update
    if (bUpdateSelf) {
      this.updateSelf();
    }
  }

  updateSelf() {
    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());

    let timer = interval(50).subscribe(() => {
      timer.unsubscribe();

      let arStages = this.angularPConnect.getComponentProp(this,"stages");

      //this.stageResults$ = this.configProps$["stages"];
      if (arStages != null) {
        this.arStageResults$ = arStages;
        this.lastStage$ = this.arStageResults$[this.arStageResults$.length -1];
      }

    });




    
  }

}
