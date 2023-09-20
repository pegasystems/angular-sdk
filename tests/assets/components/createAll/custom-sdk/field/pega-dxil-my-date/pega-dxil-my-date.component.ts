import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { interval } from 'rxjs';
import { AngularPConnectService } from '@pega/angular-sdk-library';
import { Utils } from '@pega/angular-sdk-library';
import { TextComponent } from '@pega/angular-sdk-library';
import { FieldValueListComponent } from '@pega/angular-sdk-library';

declare const window: any;

@Component({
  selector: 'app-pega-dxil-my-date',
  templateUrl: './pega-dxil-my-date.component.html',
  styleUrls: ['./pega-dxil-my-date.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TextComponent,
    FieldValueListComponent
  ]
})
export class  PegaDxilMyDateComponent implements OnInit {
  @Input() pConn$: any;
  @Input() formGroup$: FormGroup;

  // Used with AngularPConnect
  angularPConnectData: any = {};
  configProps$: Object;
  label$: string = '';
  value$: any;
  bRequired$: boolean = false;
  bReadonly$: boolean = false;
  bDisabled$: boolean = false;
  bVisible$: boolean = true;
  displayMode$: string = '';
  controlName$: string;
  bHasForm$: boolean = true;
  componentReference: string = '';
  testId: string = '';

  fieldControl = new FormControl('', null);

  constructor(
    private angularPConnect: AngularPConnectService,
    private cdRef: ChangeDetectorRef,
    private utils: Utils
  ) {}

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
    // starting very simple...
    // moved this from ngOnInit() and call this from there instead...
    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());

    if (this.configProps$['value'] != undefined) {
      let sDateValue: any = '';
      sDateValue = this.configProps$['value'];

      if (sDateValue != '') {
        if (typeof sDateValue == 'object') {
          sDateValue = sDateValue.toISOString();
        } else if (sDateValue.indexOf('/') < 0) {
          // if we have the "pega" format, then for display, convert to standard format (US)
          // sDateValue = this.formatDate(sDateValue);
          sDateValue = this.utils.generateDate(sDateValue, 'Date-Long-Custom-YYYY');
        }
        this.value$ = new Date(sDateValue);
      }
    }
    this.testId = this.configProps$['testId'];
    this.label$ = this.configProps$['label'];
    this.displayMode$ = this.configProps$['displayMode'];

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

    // trigger display of error message with field control
    if (this.angularPConnectData.validateMessage != null && this.angularPConnectData.validateMessage != '') {
      let timer = interval(100).subscribe(() => {
        this.fieldControl.setErrors({ message: true });
        this.fieldControl.markAsTouched();

        timer.unsubscribe();
      });
    }
  }

  fieldOnDateChange(event: any, sValue: string) {
    // this comes from the date pop up
    if (typeof event.value == 'object') {
      // convert date to pega "date" format
      event.value = event.value.toISOString();
    }
    this.angularPConnectData.actions.onChange(this, { value: event.value });
  }

  fieldOnClick(event: any) {}

  fieldOnBlur(event: any) {
    // PConnect wants to use eventHandler for onBlur
    if (typeof event.value == 'object') {
      event.value = event.value.toISOString();
      // convert date to pega "date" format
      event.value = event.value.toISOString();
    }
    this.angularPConnectData.actions.onBlur(this, { value: event.value });
  }

  hasErrors() {
    return this.fieldControl.status === 'INVALID';
  }

  getErrorMessage() {
    let errMessage: string = '';
    // look for validation messages for json, pre-defined or just an error pushed from workitem (400)
    if (this.fieldControl.hasError('message')) {
      errMessage = this.angularPConnectData.validateMessage;
      return errMessage;
    } else if (this.fieldControl.hasError('required')) {
      errMessage = 'You must enter a value';
    } else if (this.fieldControl.errors) {
      errMessage = `${this.fieldControl.errors.matDatepickerParse.text} is not a valid date value`;
    }
    return errMessage;
  }
}
