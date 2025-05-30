import { Component, OnInit, Input, ChangeDetectorRef, forwardRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { interval } from 'rxjs';
import { AngularPConnectData, AngularPConnectService } from '@pega/angular-sdk-components';
import { Utils } from '@pega/angular-sdk-components';
import { ComponentMapperComponent } from '@pega/angular-sdk-components';
import { PConnFieldProps } from '@pega/angular-sdk-components';
import { handleEvent } from '@pega/angular-sdk-components';
import { format } from '@pega/angular-sdk-components';

interface TimeProps extends PConnFieldProps {
  // If any, enter additional props that only exist on Time here
}

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, forwardRef(() => ComponentMapperComponent)]
})
export class TimeComponent implements OnInit, OnDestroy {
  @Input() pConn$: typeof PConnect;
  @Input() formGroup$: FormGroup;

  // Used with AngularPConnect
  angularPConnectData: AngularPConnectData = {};
  configProps$: TimeProps;

  // Time options for dropdown with 30-minute intervals
  timeOptions: { value: string; display: string }[] = [];

  label$ = '';
  value$: string;
  bRequired$ = false;
  bReadonly$ = false;
  bDisabled$ = false;
  bVisible$ = true;
  displayMode$?: string = '';
  controlName$: string;
  testId = '';
  bHasForm$ = true;
  componentReference = '';
  helperText: string;
  placeholder: string;

  fieldControl = new FormControl('', null);
  actionsApi: Object;
  propName: string;
  formattedValue$: any;
  constructor(
    private angularPConnect: AngularPConnectService,
    private cdRef: ChangeDetectorRef,
    private utils: Utils
  ) {}

  ngOnInit(): void {
    // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);
    this.controlName$ = this.angularPConnect.getComponentID(this);

    // Generate the time options for the dropdown
    this.generateTimeOptions();

    // Then, continue on with other initialization
    // call updateSelf when initializing
    // this.updateSelf();
    this.checkAndUpdate();

    if (this.formGroup$) {
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
    if (this.formGroup$) {
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
    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps()) as TimeProps;

    this.testId = this.configProps$.testId;
    this.label$ = this.configProps$.label;
    this.displayMode$ = this.configProps$.displayMode;

    if (this.configProps$.value != undefined) {
      this.value$ = this.configProps$.value;
    }
    this.helperText = this.configProps$.helperText;
    this.placeholder = this.configProps$.placeholder || '';

    this.actionsApi = this.pConn$.getActionsApi();
    this.propName = this.pConn$.getStateProps().value;

    // timeout and detectChanges to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      if (this.configProps$.required != null) {
        this.bRequired$ = this.utils.getBooleanValue(this.configProps$.required);
      }
      this.cdRef.detectChanges();
    });

    if (this.displayMode$ === 'DISPLAY_ONLY' || this.displayMode$ === 'STACKED_LARGE_VAL') {
      this.formattedValue$ = format(this.value$, 'timeonly', {
        format: 'hh:mm A'
      });
    }

    if (this.configProps$.visibility != null) {
      this.bVisible$ = this.utils.getBooleanValue(this.configProps$.visibility);
    }

    // disabled
    if (this.configProps$.disabled != undefined) {
      this.bDisabled$ = this.utils.getBooleanValue(this.configProps$.disabled);
    }

    if (this.bDisabled$) {
      this.fieldControl.disable();
    } else {
      this.fieldControl.enable();
    }

    if (this.configProps$.readOnly != null) {
      this.bReadonly$ = this.utils.getBooleanValue(this.configProps$.readOnly);
    }

    this.componentReference = this.pConn$.getStateProps().value;

    // trigger display of error message with field control
    if (this.angularPConnectData.validateMessage != null && this.angularPConnectData.validateMessage != '') {
      const timer = interval(100).subscribe(() => {
        this.fieldControl.setErrors({ message: true });
        this.fieldControl.markAsTouched();

        timer.unsubscribe();
      });
    }
  }

  fieldOnChange() {
    // this.pConn$.clearErrorMessages({
    //   property: this.propName
    // });
  }

  fieldOnBlur(event: any) {
    const value = event?.value || event?.target?.value;
    console.log('fieldOnBlur', value);
    handleEvent(this.actionsApi, 'changeNblur', this.propName, value);
  }

  getErrorMessage() {
    let errMessage = '';
    // look for validation messages for json, pre-defined or just an error pushed from workitem (400)
    if (this.fieldControl.hasError('message')) {
      errMessage = this.angularPConnectData.validateMessage ?? '';
      return errMessage;
    }
    if (this.fieldControl.hasError('required')) {
      errMessage = 'You must enter a value';
    } else if (this.fieldControl.errors) {
      errMessage = this.fieldControl.errors.toString();
    }
    return errMessage;
  }

  // Generate time options with 30-minute intervals (12:00 AM, 12:30 AM, 01:00 AM, etc.)
  generateTimeOptions(): void {
    this.timeOptions = [];

    for (let hour = 0; hour < 24; hour++) {
      // For both 00 and 30 minutes
      for (let minutes = 0; minutes < 60; minutes += 30) {
        const hourDisplay = hour === 0 || hour === 12 ? 12 : hour % 12;
        const period = hour < 12 ? 'AM' : 'PM';

        // Format the time values
        const hourFormatted = hourDisplay.toString().padStart(2, '0');
        const minuteFormatted = minutes.toString().padStart(2, '0');

        // 24-hour format for value (HH:MM)
        const hourValue = hour.toString().padStart(2, '0');
        const value = `${hourValue}:${minuteFormatted}`;

        // 12-hour format for display (HH:MM AM/PM)
        const display = `${hourFormatted}:${minuteFormatted} ${period}`;

        this.timeOptions.push({ value, display });
      }
    }
  }
}
