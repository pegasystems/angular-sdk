import { Component, OnInit, Input, ChangeDetectorRef, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AngularPConnectService } from '@pega/angular-sdk-library';
import { Utils } from '@pega/angular-sdk-library';
import { ComponentMapperComponent } from '@pega/angular-sdk-library';

@Component({
  selector: 'app-decimal',
  templateUrl: './decimal.component.html',
  styleUrls: ['./decimal.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, forwardRef(() => ComponentMapperComponent)]
})
export class DecimalComponent implements OnInit {
  @Input() pConn$: any;
  @Input() formGroup$: FormGroup;

  // Used with AngularPConnect
  angularPConnectData: any = {};
  configProps$: Object;

  label$: string = '';
  value$: number;
  bRequired$: boolean = false;
  bReadonly$: boolean = false;
  bDisabled$: boolean = false;
  bVisible$: boolean = true;
  displayMode$: string = '';
  controlName$: string;
  bHasForm$: boolean = true;
  componentReference: string = '';
  testId: string;
  helperText: string;

  fieldControl = new FormControl<number | null>(null, null);

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
    this.testId = this.configProps$['testId'];
    this.label$ = this.configProps$['label'];
    this.displayMode$ = this.configProps$['displayMode'];
    let nValue = this.configProps$['value'];
    if (nValue) {
      if (typeof nValue == 'string') {
        nValue = parseFloat(nValue);
      }
      this.value$ = nValue;
    }
    this.helperText = this.configProps$['helperText'];

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

    if (this.configProps$['readOnly'] != null) {
      this.bReadonly$ = this.utils.getBooleanValue(this.configProps$['readOnly']);
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

    this.componentReference = this.pConn$.getStateProps().value;
  }

  fieldOnChange(event: any) {
    // this.angularPConnect.changeHandler( this, event );
    this.angularPConnectData.actions.onChange(this, event);
  }

  fieldOnClick(event: any) {}

  fieldOnBlur(event: any) {
    // PConnect wants to use eventHandler for onBlur
    this.angularPConnectData.actions.onBlur(this, event);
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
      errMessage = this.fieldControl.errors.toString();
    }

    return errMessage;
  }
}

