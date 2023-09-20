import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularPConnectService } from '@pega/angular-sdk-library';
import { Utils } from '@pega/angular-sdk-library';
import { ComponentMapperComponent } from '@pega/angular-sdk-library';

declare const window: any;

@Component({
  selector: 'app-pega-dxil-my-text',
  templateUrl: './pega-dxil-my-text.component.html',
  styleUrls: ['./pega-dxil-my-text.component.scss'],
  standalone: true,
  imports: [CommonModule, forwardRef(() => ComponentMapperComponent)]
})
export class PegaDxilMyTextComponent implements OnInit {
  @Input() pConn$: any;
  @Input() formatAs$: string;

  // Used with AngularPConnect
  angularPConnectData: any = {};
  configProps$: Object;

  label$: string = '';
  value$: string = '';
  bRequired$: boolean = false;
  bReadonly$: boolean = false;
  bDisabled$: boolean = false;
  bVisible$: boolean = true;
  displayMode$: string = '';
  controlName$: string;
  componentReference: string = '';
  formattedValue$: string;
  format$: string = 'text';
  formattedUrl$: string = '';

  constructor(private angularPConnect: AngularPConnectService, private utils: Utils) {}

  ngOnInit(): void {
    // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);

    // Then, continue on with other initialization

    // call updateSelf when initializing
    this.checkAndUpdate();
  }

  ngOnDestroy(): void {
    if (this.angularPConnectData.unsubscribeFn) {
      this.angularPConnectData.unsubscribeFn();
    }
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
    if (this.configProps$['value'] != undefined) {
      this.value$ = this.configProps$['value'];
    }

    this.label$ = this.configProps$['label'];
    this.displayMode$ = this.configProps$['displayMode'];

    // TDB - get formats
    switch (this.formatAs$) {
      case 'text':
        this.formattedValue$ = this.value$;
        break;
      case 'date':
        this.formattedValue$ = this.generateDate(this.value$);
        break;
      case 'date-time':
        this.formattedValue$ = this.generateDateTime(this.value$);
        break;
      case 'time':
        if (this.value$) {
          const timeParts = this.value$.split(':');
          this.formattedValue$ = `${timeParts[0]}:${timeParts[1]}`;
        } else {
          this.formattedValue$ = '';
        }
        break;
      case 'url':
        this.formattedUrl$ = this.generateUrl(this.value$);
        this.formattedValue$ = this.value$;
        break;
    }
  }

  // Callback passed when subscribing to store change
  onStateChange() {
    this.checkAndUpdate();
  }

  generateUrl(sVal): string {
    if (sVal.indexOf('https://') == 0 || sVal.indexOf('http://') == 0) {
    } else {
      // assume no http
      sVal = 'http://' + sVal;
    }

    return sVal;
  }

  generateDate(sVal): string {
    if (!sVal) return '';
    // const value = new Intl.DateTimeFormat('default', {
    //   year: 'numeric',
    //   month: 'numeric',
    //   day: 'numeric'
    // }).format(new Date(sVal + "T00:00"));

    return this.utils.generateDate(sVal, 'Date-Long-Custom-YYYY');
  }

  generateDateTime(sVal): string {
    if (!sVal) return '';
    if (sVal.length === 10) return this.generateDate(sVal);
    let value = sVal.substring(0, sVal.length - 1);
    // value = new Intl.DateTimeFormat('default', {
    //   year: 'numeric',
    //   month: 'numeric',
    //   day: 'numeric',
    //   hour: 'numeric',
    //   minute: 'numeric',
    //   second: 'numeric',
    //   hour12: true,
    // }).format(new Date(value))

    return this.utils.generateDateTime(value, 'DateTime-Long-YYYY-Custom');
  }
}
