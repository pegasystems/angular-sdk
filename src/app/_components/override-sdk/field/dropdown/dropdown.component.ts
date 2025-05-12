import { Component, OnInit, Input, ChangeDetectorRef, forwardRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { interval } from 'rxjs';
import isEqual from 'fast-deep-equal';
import { AngularPConnectData, AngularPConnectService } from '@pega/angular-sdk-components';
import { DatapageService } from '@pega/angular-sdk-components';
import { Utils } from '@pega/angular-sdk-components';
import { ComponentMapperComponent } from '@pega/angular-sdk-components';
import { handleEvent } from '@pega/angular-sdk-components';
import { PConnFieldProps } from '@pega/angular-sdk-components';

function flattenParameters(params = {}) {
  const flatParams = {};
  Object.keys(params).forEach(key => {
    const { name, value: theVal } = params[key];
    flatParams[name] = theVal;
  });

  return flatParams;
}

function preProcessColumns(columnList) {
  return columnList.map(col => {
    const tempColObj = { ...col };
    tempColObj.value = col.value && col.value.startsWith('.') ? col.value.substring(1) : col.value;
    return tempColObj;
  });
}

function getDisplayFieldsMetaData(columnList) {
  const displayColumns = columnList.filter(col => col.display === 'true');
  const metaDataObj: any = { key: '', primary: '', secondary: [] };
  const keyCol = columnList.filter(col => col.key === 'true');
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

interface IOption {
  key: string;
  value: string;
}

// Can't use DropdownProps with 8.23 until getLocaleRuleNameFromKeys is NOT private
interface DropdownProps extends PConnFieldProps {
  // If any, enter additional props that only exist on Dropdown here
  datasource?: any[];
  onRecordChange?: any;
  fieldMetadata?: any;
  listType?: string;
  columns?: any[];
  deferDatasource?: boolean;
  datasourceMetadata?: any;
  parameters?: any;
}

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatOptionModule, forwardRef(() => ComponentMapperComponent)]
})
export class DropdownComponent implements OnInit, OnDestroy {
  @Input() pConn$: typeof PConnect;
  @Input() formGroup$: FormGroup;

  // Used with AngularPConnect
  angularPConnectData: AngularPConnectData = {};
  configProps$: DropdownProps;

  label$ = '';
  value$ = '';
  bRequired$ = false;
  bReadonly$ = false;
  bDisabled$ = false;
  bVisible$ = true;
  displayMode$?: string = '';
  controlName$: string;
  bHasForm$ = true;
  options$: IOption[];
  componentReference = '';
  testId = '';
  helperText: string;
  hideLabel: any;
  theDatasource: any[] | null;
  fieldControl = new FormControl('', null);
  fieldMetadata: any[];
  localeContext = '';
  localeClass = '';
  localeName = '';
  localePath = '';
  localizedValue = '';
  actionsApi: Object;
  propName: string;

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

    // Then, continue on with other initialization

    // call updateSelf when initializing
    // this.updateSelf();
    this.checkAndUpdate();
    // this should get called afer checkAndUpdate
    this.getDatapageData();

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
    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps()) as DropdownProps;

    if (this.configProps$.value != undefined) {
      this.value$ = this.configProps$.value;
    }

    this.testId = this.configProps$.testId;
    this.displayMode$ = this.configProps$.displayMode;
    this.label$ = this.configProps$.label;
    this.helperText = this.configProps$.helperText;
    this.hideLabel = this.configProps$.hideLabel;
    const datasource = this.configProps$.datasource;
    // timeout and detectChanges to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      if (this.configProps$.required != null) {
        this.bRequired$ = this.utils.getBooleanValue(this.configProps$.required);
      }
      this.cdRef.detectChanges();
    });

    if (!isEqual(datasource, this.theDatasource)) {
      // inbound datasource is different, so update theDatasource
      this.theDatasource = datasource || null;
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

    const optionsList = [...this.utils.getOptionList(this.configProps$, this.pConn$.getDataObject())];
    optionsList?.unshift({ key: 'Select', value: this.pConn$.getLocalizedValue('Select...', '', '') });
    this.options$ = optionsList;
    if (this.value$ === '' && !this.bReadonly$) {
      this.value$ = 'Select';
    }

    if (this.theDatasource) {
      const optionsList = [...this.utils.getOptionList(this.configProps$, this.pConn$.getDataObject())];
      optionsList?.unshift({ key: 'Select', value: this.pConn$.getLocalizedValue('Select...', '', '') });
      this.options$ = optionsList;
    }

    this.actionsApi = this.pConn$.getActionsApi();
    this.propName = this.pConn$.getStateProps().value;
    const className = this.pConn$.getCaseInfo().getClassName();
    const refName = this.propName?.slice(this.propName.lastIndexOf('.') + 1);

    this.fieldMetadata = this.configProps$.fieldMetadata;
    const metaData = Array.isArray(this.fieldMetadata) ? this.fieldMetadata.filter(field => field?.classID === className)[0] : this.fieldMetadata;

    let displayName = metaData?.datasource?.propertyForDisplayText;
    displayName = displayName?.slice(displayName.lastIndexOf('.') + 1);
    this.localeContext = metaData?.datasource?.tableType === 'DataPage' ? 'datapage' : 'associated';
    this.localeClass = this.localeContext === 'datapage' ? '@baseclass' : className;
    this.localeName = this.localeContext === 'datapage' ? metaData?.datasource?.name : refName;
    this.localePath = this.localeContext === 'datapage' ? displayName : this.localeName;

    this.localizedValue = this.pConn$.getLocalizedValue(
      this.value$,
      this.localePath,
      this.pConn$.getLocaleRuleNameFromKeys(this.localeClass, this.localeContext, this.localeName)
    );
    // trigger display of error message with field control
    if (this.angularPConnectData.validateMessage != null && this.angularPConnectData.validateMessage != '') {
      const timer = interval(100).subscribe(() => {
        this.fieldControl.setErrors({ message: true });
        this.fieldControl.markAsTouched();

        timer.unsubscribe();
      });
    }
  }

  getDatapageData() {
    const configProps = this.pConn$.getConfigProps() as DropdownProps;
    let { listType, parameters, datasource = [], columns = [] } = configProps;
    const { deferDatasource, datasourceMetadata } = configProps;
    const context = this.pConn$.getContextName();
    if (deferDatasource && datasourceMetadata?.datasource?.name) {
      listType = 'datapage';
      datasource = datasourceMetadata.datasource.name;
      const { parameters: dataSourceParameters, propertyForDisplayText, propertyForValue } = datasourceMetadata.datasource;
      parameters = flattenParameters(dataSourceParameters);
      const displayProp = propertyForDisplayText?.startsWith('@P') ? propertyForDisplayText.substring(3) : propertyForDisplayText;
      const valueProp = propertyForValue?.startsWith('@P') ? propertyForValue.substring(3) : propertyForValue;
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

    columns = preProcessColumns(columns) || [];
    if (!this.displayMode$ && listType !== 'associated' && typeof datasource === 'string') {
      this.getData(datasource, parameters, columns, context, listType);
    }
  }

  getData(dataSource, parameters, columns, context, listType) {
    const dataConfig: any = {
      columns,
      dataSource,
      deferDatasource: true,
      listType,
      parameters,
      matchPosition: 'contains',
      maxResultsDisplay: '5000',
      cacheLifeSpan: 'form'
    };
    PCore.getDataApi()
      .init(dataConfig, context)
      .then((dataApiObj: any) => {
        const optionsData: any[] = [];
        const displayColumn = getDisplayFieldsMetaData(columns);
        dataApiObj?.fetchData('').then(response => {
          response.data?.forEach(element => {
            const val = element[displayColumn.primary]?.toString();
            const obj = {
              key: element[displayColumn.key] || element.pyGUID,
              value: val
            };
            optionsData.push(obj);
          });
          optionsData?.unshift({ key: 'Select', value: this.pConn$.getLocalizedValue('Select...', '', '') });
          this.options$ = optionsData;
        });
    });
  }


  isSelected(buttonValue: string): boolean {
    return this.value$ === buttonValue;
  }

  fieldOnChange(event: any) {
    if (event?.value === 'Select') {
      event.value = '';
    }
    handleEvent(this.actionsApi, 'changeNblur', this.propName, event.value);
    if (this.configProps$?.onRecordChange) {
      this.configProps$.onRecordChange(event);
    }
    this.pConn$.clearErrorMessages({
      property: this.propName
    });
  }

  fieldOnBlur(event: any) {
    // PConnect wants to use eventHandler for onBlur
    this.angularPConnectData.actions?.onBlur(this, event);
  }

  getLocalizedOptionValue(opt: IOption) {
    return this.pConn$.getLocalizedValue(
      opt.value,
      this.localePath,
      this.pConn$.getLocaleRuleNameFromKeys(this.localeClass, this.localeContext, this.localeName)
    );
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
