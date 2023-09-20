import { Component, OnInit, Input, ChangeDetectorRef, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { interval } from 'rxjs';
import { AngularPConnectService } from '@pega/angular-sdk-library';
import { Utils } from '@pega/angular-sdk-library';
import { ComponentMapperComponent } from '@pega/angular-sdk-library';
import { DatapageService } from '@pega/angular-sdk-library';
import { handleEvent } from '@pega/angular-sdk-library';

@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule,
    forwardRef(() => ComponentMapperComponent)
  ]
})
export class AutoCompleteComponent implements OnInit {
  @Input() pConn$: any;
  @Input() formGroup$: FormGroup;

  // Used with AngularPConnect
  angularPConnectData: any = {};
  PCore$: any;
  configProps$: any;

  label$: string = '';
  value$: string = '';
  bRequired$: boolean = false;
  bReadonly$: boolean = false;
  bDisabled$: boolean = false;
  bVisible$: boolean = true;
  displayMode$: string = '';
  controlName$: string;
  bHasForm$: boolean = true;
  options$: Array<any>;
  componentReference: string = '';
  testId: string;
  listType: string;
  columns = [];

  helperText: string;
  fieldControl = new FormControl('', null);
  parameters: {};
  hideLabel: any;

  constructor(
    private angularPConnect: AngularPConnectService,
    private cdRef: ChangeDetectorRef,
    private utils: Utils,
    private dataPageService: DatapageService
  ) {}

  ngOnInit(): void {
    // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);
    this.controlName$ = this.angularPConnect.getComponentID(this);

    if (!this.PCore$) {
      this.PCore$ = window.PCore;
    }
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
      const index = this.options$?.findIndex((element) => element.key === this.configProps$['value']);
      this.value$ = index > -1 ? this.options$[index].value : this.configProps$['value'];
    }

    this.testId = this.configProps$['testId'];
    this.label$ = this.configProps$['label'];
    this.displayMode$ = this.configProps$['displayMode'];
    this.listType = this.configProps$['listType'];
    const displayMode = this.configProps$['displayMode'];
    let datasource = this.configProps$['datasource'];
    let columns = this.configProps$['columns'];
    this.hideLabel = this.configProps$['hideLabel'];
    const { deferDatasource, datasourceMetadata } = this.configProps$;
    this.helperText = this.configProps$['helperText'];
    this.parameters = this.configProps$?.parameters;
    const context = this.pConn$.getContextName();
    // convert associated to datapage listtype and transform props
    // Process deferDatasource when datapage name is present. WHhen tableType is promptList / localList
    if (deferDatasource && datasourceMetadata?.datasource?.name) {
      this.listType = 'datapage';
      datasource = datasourceMetadata.datasource.name;
      this.parameters = this.flattenParameters(datasourceMetadata?.datasource?.parameters);
      const displayProp = datasourceMetadata.datasource.propertyForDisplayText.startsWith('@P')
        ? datasourceMetadata.datasource.propertyForDisplayText.substring(3)
        : datasourceMetadata.datasource.propertyForDisplayText;
      const valueProp = datasourceMetadata.datasource.propertyForValue.startsWith('@P')
        ? datasourceMetadata.datasource.propertyForValue.substring(3)
        : datasourceMetadata.datasource.propertyForValue;
      columns = [
        {
          key: 'true',
          setProperty: 'Associated property',
          value: valueProp
        },
        {
          display: 'true',
          primary: 'true',
          useForSearch: true,
          value: displayProp
        }
      ];
    }
    if (columns) {
      this.columns = this.preProcessColumns(columns);
    }
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
    if (this.listType === 'associated') {
      this.options$ = this.utils.getOptionList(this.configProps$, this.pConn$.getDataObject());
    }

    if (!displayMode && this.listType !== 'associated') {
      const workListData = this.PCore$.getDataApiUtils().getData(datasource, {});

      workListData.then((workListJSON: Object) => {
        const optionsData: Array<any> = [];
        const results = workListJSON['data'].data;
        const displayColumn = this.getDisplayFieldsMetaData(this.columns);
        results?.forEach((element) => {
          const obj = {
            key: element.pyGUID || element[displayColumn.primary],
            value: element[displayColumn.primary]?.toString()
          };
          optionsData.push(obj);
        });
        this.options$ = optionsData;
      });
    }

    // trigger display of error message with field control
    if (this.angularPConnectData.validateMessage != null && this.angularPConnectData.validateMessage != '') {
      let timer = interval(100).subscribe(() => {
        this.fieldControl.setErrors({ message: true });
        this.fieldControl.markAsTouched();

        timer.unsubscribe();
      });
    }
  }

  flattenParameters(params = {}) {
    const flatParams = {};
    Object.keys(params).forEach((key) => {
      const { name, value: theVal } = params[key];
      flatParams[name] = theVal;
    });

    return flatParams;
  }

  getDisplayFieldsMetaData(columnList) {
    const displayColumns = columnList.filter((col) => col.display === 'true');
    const metaDataObj: any = { key: '', primary: '', secondary: [] };
    const keyCol = columnList.filter((col) => col.key === 'true');
    metaDataObj.key = keyCol.length > 0 ? keyCol[0].value : 'auto';
    for (let index = 0; index < displayColumns.length; index += 1) {
      if (displayColumns[index].primary === 'true') {
        metaDataObj.primary = displayColumns[index].value;
      } else {
        metaDataObj.secondary.push(displayColumns[index].value);
      }
    }
    return metaDataObj;
  }

  preProcessColumns(columnList) {
    return columnList?.map((col) => {
      const tempColObj = { ...col };
      tempColObj.value = col.value && col.value.startsWith('.') ? col.value.substring(1) : col.value;
      return tempColObj;
    });
  }

  isSelected(buttonValue: string): boolean {
    if (this.value$ === buttonValue) {
      return true;
    }

    return false;
  }

  fieldOnChange(event: any) {
    // this works - this.pConn$.setValue( this.componentReference, `property: ${this.componentReference}`);
    // this works - this.pConn$.setValue( this.componentReference, this.fieldControl.value);
    // PConnect wants to use changeHandler for onChange
    // this.angularPConnect.changeHandler( this, event);
    this.angularPConnectData.actions.onChange(this, event);
  }

  optionChanged(event: any) {
    this.angularPConnectData.actions.onChange(this, event);
  }

  fieldOnClick(event: any) {}

  fieldOnBlur(event: any) {
    let key = '';
    if (event?.target?.value) {
      const index = this.options$?.findIndex((element) => element.value === event.target.value);
      key = index > -1 ? (key = this.options$[index].key) : event.target.value;
    }

    const value = key;
    const actionsApi = this.pConn$?.getActionsApi();
    const propName = this.pConn$?.getStateProps().value;
    handleEvent(actionsApi, 'changeNblur', propName, value);
    if (this.configProps$?.onRecordChange) {
      event.target.value = value;
      this.configProps$.onRecordChange(event);
    }
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
