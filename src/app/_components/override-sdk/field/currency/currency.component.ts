import { Component, OnInit, Input, ChangeDetectorRef, forwardRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { interval } from 'rxjs';
import { NgxCurrencyDirective, NgxCurrencyInputMode } from 'ngx-currency';
import { AngularPConnectData, AngularPConnectService } from '@pega/angular-sdk-components';
import { Utils } from '@pega/angular-sdk-components';
import { ComponentMapperComponent } from '@pega/angular-sdk-components';
import { handleEvent } from '@pega/angular-sdk-components';
import { getCurrencyCharacters, getCurrencyOptions } from '@pega/angular-sdk-components';
import { PConnFieldProps } from '@pega/angular-sdk-components';
import { format } from '@pega/angular-sdk-components';

interface CurrrencyProps extends PConnFieldProps {
  // If any, enter additional props that only exist on Currency here
  currencyISOCode?: string;
  allowDecimals: boolean;
  formatter?: string;
}

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, NgxCurrencyDirective, forwardRef(() => ComponentMapperComponent)]
})
export class CurrencyComponent implements OnInit, OnDestroy {
  @Input() pConn$: typeof PConnect;
  @Input() formGroup$: FormGroup;

  // Used with AngularPConnect
  angularPConnectData: AngularPConnectData = {};
  configProps$: CurrrencyProps;

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
  testId: string;
  helperText: string;
  placeholder: string;
  currencyISOCode = 'USD';
  currencyOptions: Object = {};

  fieldControl = new FormControl<number | null>(null, { updateOn: 'blur' });
  currencySymbol: string;
  thousandSeparator: string;
  decimalSeparator: string;
  inputMode: any;
  decimalPrecision: number | undefined;
  formattedValue: string;
  formatter;

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
    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps()) as CurrrencyProps;
    this.testId = this.configProps$.testId;
    this.label$ = this.configProps$.label;
    this.displayMode$ = this.configProps$.displayMode;
    this.inputMode = NgxCurrencyInputMode.Natural;
    let nValue: any = this.configProps$.value;
    if (nValue) {
      if (typeof nValue === 'string') {
        nValue = parseFloat(nValue);
      }
      this.value$ = nValue;
    }
    this.helperText = this.configProps$.helperText;
    this.placeholder = this.configProps$.placeholder || '';
    const currencyISOCode = this.configProps$?.currencyISOCode ?? '';

    const theSymbols = getCurrencyCharacters(currencyISOCode);
    this.currencySymbol = theSymbols.theCurrencySymbol;
    this.thousandSeparator = theSymbols.theDigitGroupSeparator;
    this.decimalSeparator = theSymbols.theDecimalIndicator;
    this.formatter = this.configProps$.formatter;

    if (this.displayMode$ === 'DISPLAY_ONLY' || this.displayMode$ === 'STACKED_LARGE_VAL') {
      const theCurrencyOptions = getCurrencyOptions(currencyISOCode);
      if (this.formatter) {
        this.formattedValue = format(this.value$, this.formatter.toLowerCase(), theCurrencyOptions);
      } else {
        this.formattedValue = format(this.value$, 'currency', theCurrencyOptions);
      }
    }

    // timeout and detectChanges to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      if (this.configProps$.required != null) {
        this.bRequired$ = this.utils.getBooleanValue(this.configProps$.required);
      }
      this.cdRef.detectChanges();
    });

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

    if (this.configProps$.currencyISOCode != null) {
      this.currencyISOCode = this.configProps$.currencyISOCode;
    }

    this.decimalPrecision = this.configProps$?.allowDecimals ? 2 : 0;

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

  fieldOnBlur(event: any) {
    const actionsApi = this.pConn$?.getActionsApi();
    const propName = this.pConn$?.getStateProps().value;
    let value = event?.target?.value;
    value = value?.substring(1);
    // replacing thousand separator with empty string as not required in api call
    const thousandSep = this.thousandSeparator === '.' ? '\\.' : this.thousandSeparator;
    let regExp = new RegExp(String.raw`${thousandSep}`, 'g');
    value = value?.replace(regExp, '');
    // replacing decimal separator with '.'
    if (this.decimalSeparator !== '.') {
      regExp = new RegExp(String.raw`${this.decimalSeparator}`, 'g');
      value = value.replace(regExp, '.');
    }
    handleEvent(actionsApi, 'changeNblur', propName, value);
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
}
