import { Component, OnInit, Input, ChangeDetectorRef, forwardRef, Inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { interval } from 'rxjs';
import { AngularPConnectData, AngularPConnectService } from '@pega/angular-sdk-components';
import { Utils } from '@pega/angular-sdk-components';
import { ComponentMapperComponent } from '@pega/angular-sdk-components';
import { dateFormatInfoDefault, getDateFormatInfo } from '@pega/angular-sdk-components';
import { PConnFieldProps } from '@pega/angular-sdk-components';
import { format } from '@pega/angular-sdk-components';
import { handleEvent } from '@pega/angular-sdk-components';

interface DateProps extends PConnFieldProps {
  // If any, enter additional props that only exist on Date here
}

class MyFormat {
  theDateFormat = getDateFormatInfo();

  get display() {
    return {
      dateInput: this.theDateFormat.dateFormatString,
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY'
    };
  }

  get parse() {
    return {
      dateInput: this.theDateFormat.dateFormatString
    };
  }
}

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MomentDateModule,
    forwardRef(() => ComponentMapperComponent)
  ],
  providers: [{ provide: MAT_DATE_FORMATS, useClass: MyFormat }]
})
export class DateComponent implements OnInit, OnDestroy {
  @Input() pConn$: typeof PConnect;
  @Input() formGroup$: FormGroup;

  // Used with AngularPConnect
  angularPConnectData: AngularPConnectData = {};
  configProps$: DateProps;

  label$ = '';
  value$: any;
  bRequired$ = false;
  bReadonly$ = false;
  bDisabled$ = false;
  bVisible$ = true;
  displayMode$?: string = '';
  controlName$: string;
  bHasForm$ = true;
  componentReference = '';
  testId = '';
  helperText: string;
  placeholder: string;

  fieldControl = new FormControl('', null);

  // Start with default dateFormatInfo
  dateFormatInfo = dateFormatInfoDefault;
  // and then update, as needed, based on locale, etc.
  theDateFormat = getDateFormatInfo();
  actionsApi: Object;
  propName: string;
  formattedValue$: any;

  constructor(
    private angularPConnect: AngularPConnectService,
    private cdRef: ChangeDetectorRef,
    private utils: Utils,
    @Inject(MAT_DATE_FORMATS) private config: MyFormat
  ) {}

  ngOnInit(): void {
    this.dateFormatInfo = this.theDateFormat;
    // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);
    this.controlName$ = this.angularPConnect.getComponentID(this);

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
    // starting very simple...
    // moved this from ngOnInit() and call this from there instead...
    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps()) as DateProps;

    this.value$ = this.configProps$.value;
    this.testId = this.configProps$.testId;
    this.label$ = this.configProps$.label;
    this.displayMode$ = this.configProps$.displayMode;
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
      this.formattedValue$ = format(this.value$, 'date', {
        format: this.theDateFormat.dateFormatString
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

  fieldOnDateChange(event: any) {
    // this comes from the date pop up
    const value = event?.target?.value.format('YYYY-MM-DD');
    handleEvent(this.actionsApi, 'changeNblur', this.propName, value);
    this.pConn$.clearErrorMessages({
      property: this.propName
    });
  }

  // fieldOnBlur(event: any) {
  //   // PConnect wants to use eventHandler for onBlur
  //   if (typeof event.value === 'object') {
  //     // convert date to pega "date" format
  //     event.value = event.value?.toISOString();
  //   }
  //   const value = event?.target?.value;
  //   handleEvent(this.actionsApi, 'changeNblur', this.propName, value);
  // }

  hasErrors() {
    return this.fieldControl.status === 'INVALID';
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
      errMessage = `${this.fieldControl.errors['matDatepickerParse'].text} is not a valid date value`;
    }
    return errMessage;
  }

  // getFormattedValue() {
  //   return format(this.value$, 'date', {
  //     format: this.theDateFormat.dateFormatString
  //   });
  // }
}
