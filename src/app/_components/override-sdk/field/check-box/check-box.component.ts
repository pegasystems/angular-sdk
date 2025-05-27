import { Component, OnInit, Input, ChangeDetectorRef, forwardRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { interval } from 'rxjs';
import { AngularPConnectData, AngularPConnectService } from '@pega/angular-sdk-components';
import { Utils } from '@pega/angular-sdk-components';
import { ComponentMapperComponent } from '@pega/angular-sdk-components';
import { PConnFieldProps } from '@pega/angular-sdk-components';
import { deleteInstruction, insertInstruction, updateNewInstructions } from '@pega/angular-sdk-components';
import { handleEvent } from '@pega/angular-sdk-components';

interface CheckboxProps extends Omit<PConnFieldProps, 'value'> {
  // If any, enter additional props that only exist on Checkbox here
  // Everything from PConnFieldProps except value and change type of value to boolean
  value: boolean;
  caption?: string;
  trueLabel?: string;
  falseLabel?: string;
  selectionMode?: string;
  datasource?: any;
  selectionKey?: string;
  selectionList?: any;
  primaryField: string;
  readonlyContextList: any;
  referenceList: string;
  variant?: string;
}

@Component({
  selector: 'app-check-box',
  templateUrl: './check-box.component.html',
  styleUrls: ['./check-box.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCheckboxModule, MatFormFieldModule, MatOptionModule, forwardRef(() => ComponentMapperComponent)]
})
export class CheckBoxComponent implements OnInit, OnDestroy {
  @Input() pConn$: typeof PConnect;
  @Input() formGroup$: FormGroup;

  // Used with AngularPConnect
  angularPConnectData: AngularPConnectData = {};
  configProps$: CheckboxProps;

  label$ = '';
  value$: any = '';
  caption$?: string = '';
  testId = '';
  showLabel$ = false;
  isChecked$ = false;
  bRequired$ = false;
  bReadonly$ = false;
  bDisabled$ = false;
  bVisible$ = true;
  displayMode$?: string = '';
  controlName$: string;
  bHasForm$ = true;
  componentReference = '';
  helperText: string;
  trueLabel$?: string;
  falseLabel$?: string;

  selectionMode?: string;
  datasource?: any;
  selectionKey?: string;
  selectionList?: any;
  primaryField: string;
  selectedvalues: any;
  referenceList: string;
  listOfCheckboxes: any[] = [];
  actionsApi: Object;
  propName: string;

  fieldControl = new FormControl('', null);

  constructor(
    private angularPConnect: AngularPConnectService,
    private cdRef: ChangeDetectorRef,
    private utils: Utils
  ) {}

  ngOnInit(): void {
    console.log('checkbox this.configProps$');
    // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);
    this.controlName$ = this.angularPConnect.getComponentID(this);

    // Then, continue on with other initialization

    // call updateSelf when initializing
    // this.updateSelf();
    this.checkAndUpdate();

    if (this.selectionMode === 'multi' && this.referenceList?.length > 0) {
      this.pConn$.setReferenceList(this.selectionList);
      updateNewInstructions(this.pConn$, this.selectionList);
    }

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
    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps()) as CheckboxProps;

    this.testId = this.configProps$.testId;
    this.displayMode$ = this.configProps$.displayMode;
    this.label$ = this.configProps$.label;
    if (this.label$ != '') {
      this.showLabel$ = true;
    }

    this.actionsApi = this.pConn$.getActionsApi();
    this.propName = this.pConn$.getStateProps().value;
    console.log('checkbox this.configProps$', this.configProps$);
    // multi case
    this.selectionMode = this.configProps$.selectionMode;
    if (this.selectionMode === 'multi') {
      this.referenceList = this.configProps$.referenceList;
      this.selectionList = this.configProps$.selectionList;
      this.selectedvalues = this.configProps$.readonlyContextList;
      this.primaryField = this.configProps$.primaryField;

      this.datasource = this.configProps$.datasource;
      this.selectionKey = this.configProps$.selectionKey;
      let listSourceItems = this.datasource?.source ?? [];
      const dataField = this.selectionKey?.split?.('.')[1] ?? '';
      const listToDisplay: any[] = [];

      if (this.configProps$.variant === 'card') {
        const stateProps = this.pConn$.getStateProps();
        listSourceItems = listSourceItems.map(item => {
          const newItem = { key: '', value: '' };
          newItem.key = item[stateProps?.datasource?.fields?.key.substring(1)];
          newItem.value = item[stateProps?.datasource?.fields?.text.substring(1)];
          return newItem;
        });
      }

      listSourceItems.forEach(element => {
        element.selected = this.selectedvalues?.some?.(data => data[dataField] === element.key);
        listToDisplay.push(element);
      });

      this.listOfCheckboxes = listToDisplay;
    } else {
      if (this.configProps$.value != undefined) {
        this.value$ = this.configProps$.value;
      }

      this.caption$ = this.configProps$.caption;

      this.trueLabel$ = this.configProps$.trueLabel || 'Yes';
      this.falseLabel$ = this.configProps$.falseLabel || 'No';

      // eslint-disable-next-line sonarjs/no-redundant-boolean
      if (this.value$ === 'true' || this.value$ == true) {
        this.isChecked$ = true;
      } else {
        this.isChecked$ = false;
      }
    }

    this.helperText = this.configProps$.helperText;
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

    if (this.configProps$.readOnly != null) {
      this.bReadonly$ = this.utils.getBooleanValue(this.configProps$.readOnly);
    }

    if (this.bDisabled$ || this.bReadonly$) {
      this.fieldControl.disable();
    } else {
      this.fieldControl.enable();
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

  fieldOnChange(event: any) {
    event.value = event.checked;
    handleEvent(this.actionsApi, 'changeNblur', this.propName, event.checked);
    // this.pConn$.clearErrorMessages({
    //   property: this.propName
    // });
  }

  fieldOnBlur(event: any) {
    if (this.selectionMode === 'multi') {
      this.pConn$.getValidationApi().validate(this.selectedvalues, this.selectionList);
    } else {
      this.pConn$.getValidationApi().validate(event.target.checked);
    }
  }

  handleChangeMultiMode(event, element) {
    console.log('this.selectionList', this.selectionList);
    if (!element.selected) {
      insertInstruction(this.pConn$, this.selectionList, this.selectionKey, this.primaryField, {
        id: element.key,
        primary: element.text ?? element.value
      });
    } else {
      deleteInstruction(this.pConn$, this.selectionList, this.selectionKey, {
        id: element.key,
        primary: element.text ?? element.value
      });
    }
    this.pConn$.clearErrorMessages({
      property: this.selectionList
    });
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
