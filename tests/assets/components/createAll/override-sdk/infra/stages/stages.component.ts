import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval } from 'rxjs';
import { AngularPConnectService } from '@pega/angular-sdk-library';
import { Utils } from '@pega/angular-sdk-library';

declare const window: any;

@Component({
  selector: 'app-stages',
  templateUrl: './stages.component.html',
  styleUrls: ['./stages.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class StagesComponent implements OnInit {
  @Input() pConn$: any;

  // Used with AngularPConnect
  angularPConnectData: any = {};
  PCore$: any;
  configProps$: Object;

  arStageResults$: Array<any>;
  lastStage$: any;
  checkSvgIcon$: string;

  constructor(private angularPConnect: AngularPConnectService, private utils: Utils) {}

  ngOnInit(): void {
    if (!this.PCore$) {
      this.PCore$ = window.PCore;
    }

    // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);

    const imagePath = this.utils.getIconPath(this.utils.getSDKStaticContentUrl());
    this.checkSvgIcon$ = this.utils.getImageSrc('check', this.utils.getSDKStaticContentUrl());
  }

  ngOnDestroy(): void {
    if (this.angularPConnectData.unsubscribeFn) {
      this.angularPConnectData.unsubscribeFn();
    }
  }

  // Callback passed when subscribing to store change
  onStateChange() {
    this.checkAndUpdate();
  }

  checkAndUpdate() {
    // Should always check the bridge to see if the component should
    // update itself (re-render)
    const bUpdateSelf = this.angularPConnect.shouldComponentUpdate(this);

    // ONLY call updateSelf when the component should update
    if (bUpdateSelf) {
      this.updateSelf();
    }
  }

  updateSelf() {
    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());

    let timer = interval(50).subscribe(() => {
      timer.unsubscribe();

      let arStages = this.angularPConnect.getComponentProp(this, 'stages');

      //this.stageResults$ = this.configProps$["stages"];
      if (arStages != null) {
        this.arStageResults$ = arStages;
        this.lastStage$ = this.arStageResults$[this.arStageResults$.length - 1];
      }
    });
  }
}
