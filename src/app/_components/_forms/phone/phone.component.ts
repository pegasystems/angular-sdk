import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Utils } from "../../../_helpers/utils";
import { AngularPConnectService } from "../../../_bridge/angular-pconnect";
import { interval } from "rxjs/internal/observable/interval";
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { handleEvent } from '../../../_helpers/event-util';
@Component({
  selector: 'app-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.scss']
})
export class PhoneComponent implements OnInit {

  @Input() pConn$: any;
  @Input() formGroup$: FormGroup;

  configProps$ : Object;

  label$: string = "";
  value$: number;
  bRequired$: boolean = false;
  bReadonly$: boolean = false;
  bDisabled$: boolean = false;
  bVisible$: boolean = true;
  controlName$: string;

  bHasForm$: boolean = true;

  componentReference: string = "";
  testId: string;

  fieldControl = new FormControl('', null); 

  // Used with AngularPConnect
  angularPConnectData: any = {};

  constructor(private angularPConnect: AngularPConnectService,
              private cdRef: ChangeDetectorRef, 
              private utils: Utils) {   

  }
  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	phoneForm = new FormGroup({
		phone: new FormControl(undefined)
	});
  afterBlur: boolean;

  ngOnInit(): void {
    // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);
    this.controlName$ = this.angularPConnect.getComponentID(this);

    // Then, continue on with other initialization

    // call updateSelf when initializing
    //this.updateSelf();
    this.checkAndUpdate();
     
    
    if (null != this.formGroup$) {
      // add control to formGroup
      this.formGroup$.addControl(this.controlName$, this.fieldControl);
      this.fieldControl.setValue(this.value$);
      this.bHasForm$ = true;
    }
    else {
      this.bReadonly$ = true;
      this.bHasForm$ = false;
    }

  }

  ngOnDestroy(): void {

    if (null != this.formGroup$) {
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
    const bUpdateSelf = this.angularPConnect.shouldComponentUpdate( this );
  
    // ONLY call updateSelf when the component should update
    if (bUpdateSelf) {
      this.updateSelf();
    }
  }

  // updateSelf
  updateSelf(): void {

    // moved this from ngOnInit() and call this from there instead...
    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());

    this.label$ = this.configProps$["label"];
    this.testId = this.configProps$["testId"];
    if (this.configProps$["value"] != undefined) {
      this.value$ = this.configProps$["value"];
    }
  

    // timeout and detectChanges to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      if (this.configProps$["required"] != null) {
        this.bRequired$ = this.utils.getBooleanValue(this.configProps$["required"]);
      }
      this.cdRef.detectChanges();
    });

    if (this.configProps$["visibility"] != null) {
      this.bVisible$ = this.utils.getBooleanValue(this.configProps$["visibility"]);
    }

    // disabled
    if (this.configProps$["disabled"] != undefined) {
      this.bDisabled$ = this.utils.getBooleanValue(this.configProps$["disabled"]);
    }
  
    if (this.bDisabled$) {
      this.fieldControl.disable();
    }
    else {
      this.fieldControl.enable();
    }
    
    if (this.configProps$["readOnly"] != null) {
      this.bReadonly$ = this.utils.getBooleanValue(this.configProps$["readOnly"]);
    }
    
    if (this.bReadonly$) {
      this.phoneForm.setValue({ phone: this.value$ });
    }

    this.componentReference = this.pConn$.getStateProps().value;

    // trigger display of error message with field control
    if (null != this.angularPConnectData.validateMessage && "" != this.angularPConnectData.validateMessage) {
      let timer = interval(100).subscribe(() => {
        this.fieldControl.setErrors({'message': true});
        this.fieldControl.markAsTouched();

        timer.unsubscribe();
        });
    
    }    

  }

  fieldOnChange(event: any) {
    if(this.formGroup$.controls[this.controlName$].value) {
      const actionsApi = this.pConn$?.getActionsApi();
      const propName = this.pConn$?.getStateProps().value;
      const value = this.formGroup$.controls[this.controlName$].value.e164Number;
      const eventObj = {
        target: {
          value: value,
        }
      };
      this.afterBlur = true;
      this.angularPConnectData.actions.onChange(this, eventObj);
      handleEvent(actionsApi, "blur", propName, value);
    }
  }

  fieldOnClick(event: any) {

  }

  fieldOnBlur(event: any) {
    // PConnect wants to use eventHandler for onBlur
    this.angularPConnectData.actions.onBlur(this, event);

  }

  getErrorMessage() {

    let errMessage : string = "";


    // look for validation messages for json, pre-defined or just an error pushed from workitem (400)
    if (this.fieldControl.hasError('message')) {
      errMessage = this.angularPConnectData.validateMessage;
      return errMessage;
    }
    else if (this.fieldControl.hasError('required')) {

      errMessage = 'You must enter a value';
    }
    else if (this.fieldControl.errors) {

      errMessage = 'Invalid Phone';

    }


    return errMessage;
  }
}
