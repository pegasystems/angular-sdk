import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AngularPConnectService } from '../../../_bridge/angular-pconnect';
import { Utils } from '../../../_helpers/utils';

@Component({
  selector: 'app-check-box',
  templateUrl: './check-box.component.html',
  styleUrls: ['./check-box.component.scss'],
})
export class CheckBoxComponent implements OnInit {
  @Input() pConn$: any;
  @Input() formGroup$: FormGroup;

  // Used with AngularPConnect
  angularPConnectData: any = {};
  configProps$: Object;

  label$: string = '';
  value$: any = '';
  caption$: string = '';
  testId: string = '';
  showLabel$: boolean = false;
  checkboxLabelPos$ = 'after';
  isChecked$: boolean = false;
  bRequired$: boolean = false;
  bReadonly$: boolean = false;
  bDisabled$: boolean = false;
  bVisible$: boolean = true;
  displayMode$: string = '';
  controlName$: string;
  bHasForm$: boolean = true;
  componentReference: string = '';

  fieldControl = new FormControl('', null);

  constructor(private angularPConnect: AngularPConnectService, private cdRef: ChangeDetectorRef, private utils: Utils) {}

  ngOnInit(): void {
    // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);
    this.controlName$ = this.angularPConnect.getComponentID(this);

    // Then, continue on with other initialization

    // call updateSelf when initializing
    //this.updateSelf();
    this.checkAndUpdate();

    if (this.formGroup$ != null) {
      // add control to formGroup
      this.formGroup$.addControl(this.controlName$, this.fieldControl);
      this.fieldControl.setValue(this.value$);
      this.bHasForm$ = true;
    } else {
      this.bReadonly$ = true;
      this.bHasForm$ = false;
    }
  }

  ngOnDestroy(): void {
    if (this.formGroup$ != null) {
      this.formGroup$.removeControl(this.controlName$);
    }

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

  // updateSelf
  updateSelf(): void {
    // moved this from ngOnInit() and call this from there instead...
    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());

    if (this.configProps$['value'] != undefined) {
      this.value$ = this.configProps$['value'];
    }
    this.testId = this.configProps$['testId'];
    this.label$ = this.configProps$['label'];
    this.displayMode$ = this.configProps$['displayMode'];
    this.caption$ = this.configProps$['caption'];

    // timeout and detectChanges to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      if (this.configProps$['required'] != null) {
        this.bRequired$ = this.utils.getBooleanValue(this.configProps$['required']);
      }
      this.cdRef.detectChanges();
    });

    if (this.configProps$['visibility'] != null) {
      this.bVisible$ = this.utils.getBooleanValue(this.configProps$['visibility']);
    }

    // disabled
    if (this.configProps$['disabled'] != undefined) {
      this.bDisabled$ = this.utils.getBooleanValue(this.configProps$['disabled']);
    }

    if (this.bDisabled$) {
      this.fieldControl.disable();
    } else {
      this.fieldControl.enable();
    }

    if (this.configProps$['readOnly'] != null) {
      this.bReadonly$ = this.utils.getBooleanValue(this.configProps$['readOnly']);
    }

    this.componentReference = this.pConn$.getStateProps().value;

    if (this.label$ != '') {
      this.showLabel$ = true;
    }

    if (this.value$ === 'true' || this.value$ == true) {
      this.isChecked$ = true;
    } else {
      this.isChecked$ = false;
    }
  }

  fieldOnChange(event: any) {
    event.value = event.checked;

    this.angularPConnectData.actions.onChange(this, event);
  }

  fieldOnClick(event: any) {}

  fieldOnBlur(event: any) {
    event.value = event.checked;
    this.angularPConnectData.actions.onBlur(this, event);
  }
}
