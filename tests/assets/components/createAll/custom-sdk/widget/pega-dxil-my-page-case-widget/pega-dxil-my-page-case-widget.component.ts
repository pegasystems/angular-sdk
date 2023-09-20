import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Utils } from '@pega/angular-sdk-library';
import { ComponentMapperComponent } from '@pega/angular-sdk-library';
import { AngularPConnectService } from '@pega/angular-sdk-library';

declare const window: any;

@Component({
  selector: 'app-pega-dxil-my-page-case-widget',
  templateUrl: './pega-dxil-my-page-case-widget.component.html',
  styleUrls: ['./pega-dxil-my-page-case-widget.component.scss'],
  standalone: true,
  imports: [CommonModule, forwardRef(() => ComponentMapperComponent)]
})
export class PegaDxilMyPageCaseWidgetComponent implements OnInit {
   @Input() status$: string;
  @Input() bShowStatus$: boolean;

  @Input() primaryFields$: Array<any>;

  @Input() pConn$: any;
  PCore$: any;

  // For interaction with AngularPConnect
  angularPConnectData: any = {};
  configProps$: Object;

  controlName$: string;


  constructor(private utils: Utils, private angularPConnect: AngularPConnectService) {}

  ngOnInit(): void {

    if (!this.PCore$) {
      this.PCore$ = window.PCore;
    }

    // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);
    this.controlName$ = this.angularPConnect.getComponentID(this);

    // call updateSelf when initializing
    // this.updateSelf();
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

  // updateSelf
  updateSelf(): void {
    // moved this from ngOnInit() and call this from there instead...
    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());

    this.primaryFields$ = new Array();

    let createConfig = {}
    createConfig["label"] = this.configProps$["label"];
    createConfig["updateDateTime"] = this.configProps$["createDateTime"];
    createConfig["displayLabel"] = this.configProps$["createLabel"];
    createConfig["createOperator"] = this.configProps$["createOperator"];
    let elConfig = {};
    elConfig["config"] = createConfig;

    this.primaryFields$.push(elConfig);

    let updateConfig = {};
    updateConfig["label"] = this.configProps$["updateLabel"];
    updateConfig["updateDateTime"] = this.configProps$["updateDateTime"];
    updateConfig["displayLabel"] = this.configProps$["updateLabel"];
    updateConfig["updateOperator"] = this.configProps$["updateOperator"];
    let elConfig1 = {};
    elConfig1["config"] = updateConfig;

    this.primaryFields$.push(elConfig1);
  }

  // Callback passed when subscribing to store change
  onStateChange() {
    this.checkAndUpdate();
  }

  ngOnChanges() {
    this.updateLabelAndDate(this.primaryFields$);
  }

  updateLabelAndDate(arData: Array<any>) {
    for (let field of arData) {
      switch (field.type.toLowerCase()) {
        case 'caseoperator':
          if (field.config.label.toLowerCase() == 'create operator') {
            field.config['displayLabel'] = field.config.createLabel;
          } else if (field.config.label.toLowerCase() == 'update operator') {
            field.config['displayLabel'] = field.config.updateLabel;
          }
          break;
        case 'date':
          field.config.value = this.utils.generateDate(field.config.value, 'Date-Long');
          break;
      }
    }
  }
}
