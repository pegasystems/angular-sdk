import { Component, OnInit, Input, forwardRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { AngularPConnectData, AngularPConnectService } from '@pega/angular-sdk-components';
import { ComponentMapperComponent } from '@pega/angular-sdk-components';

const SELECTION_MODE = { SINGLE: 'single', MULTI: 'multi' };

@Component({
  selector: 'app-data-reference',
  templateUrl: './data-reference.component.html',
  styleUrls: ['./data-reference.component.scss'],
  standalone: true,
  imports: [CommonModule, forwardRef(() => ComponentMapperComponent)]
})
export class DataReferenceComponent implements OnInit, OnDestroy {
  @Input() pConn$: typeof PConnect;
  @Input() formGroup$: FormGroup;

  // Used with AngularPConnect
  angularPConnectData: AngularPConnectData = {};

  arFields$: any[] = [];
  referenceType = '';
  selectionMode = '';
  parameters;
  hideLabel = false;
  childrenToRender: any[] = [];
  dropDownDataSource = '';
  isDisplayModeEnabled = false;
  propsToUse: any = {};
  rawViewMetadata: any = {};
  viewName = '';
  firstChildMeta: any = {};
  canBeChangedInReviewMode = false;
  propName = '';
  firstChildPConnect;
  children;
  displaySingleRef: boolean;
  displayMultiRef: boolean;
  refList: any;

  constructor(private angularPConnect: AngularPConnectService) {}

  ngOnInit(): void {
    console.log('DataReferenceComponent ngOnInit');
    // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);
    this.children = this.pConn$.getChildren();
    this.updateSelf();
    if (this.firstChildMeta?.type === 'Dropdown' && this.rawViewMetadata.config?.parameters) {
      const { value, key, text } = this.firstChildMeta.config.datasource.fields;
      PCore.getDataApiUtils()
        .getData(
          this.refList,
          {
            dataViewParameters: this.parameters
          },
          ''
        )
        .then(res => {
          if (res.data.data !== null) {
            const ddDataSource = res.data.data
              .map(listItem => ({
                key: listItem[key.split(' .', 2)[1]],
                text: listItem[text.split(' .', 2)[1]],
                value: listItem[value.split(' .', 2)[1]]
              }))
              .filter(item => item.key);
            // Filtering out undefined entries that will break preview
            this.dropDownDataSource = ddDataSource;
            this.updateSelf();
          } else {
            const ddDataSource: any = [];
            this.dropDownDataSource = ddDataSource;
          }
        })
        .catch(() => {
          return Promise.resolve({
            data: { data: [] }
          });
        });
    }
  }

  ngOnDestroy(): void {
    if (this.angularPConnectData.unsubscribeFn) {
      this.angularPConnectData.unsubscribeFn();
    }
  }

  // Callback passed when subscribing to store change
  onStateChange() {
    // Should always check the bridge to see if the component should
    // update itself (re-render)
    const bUpdateSelf = this.angularPConnect.shouldComponentUpdate(this);

    // ONLY call updateSelf when the component should update
    if (bUpdateSelf) {
      this.updateSelf();
    }
  }

  updateSelf() {
    // Update properties based on configProps
    const theConfigProps = this.pConn$.getConfigProps();
    this.updatePropertiesFromProps(theConfigProps);

    const displayAs = theConfigProps.displayAs;
    const displayMode = theConfigProps.displayMode;
    this.rawViewMetadata = this.pConn$.getRawMetadata();
    this.viewName = this.rawViewMetadata.name;
    this.firstChildMeta = this.rawViewMetadata.children[0];
    this.refList = this.rawViewMetadata.config.referenceList;
    this.canBeChangedInReviewMode = theConfigProps.allowAndPersistChangesInReviewMode && (displayAs === 'autocomplete' || displayAs === 'dropdown');
    // this.childrenToRender = this.children;
    this.isDisplayModeEnabled = ['DISPLAY_ONLY', 'STACKED_LARGE_VAL'].includes(displayMode);

    if (this.firstChildMeta?.type !== 'Region') {
      this.firstChildPConnect = this.pConn$.getChildren()[0].getPConnect;

      /* remove refresh When condition from those old view so that it will not be used for runtime */
      if (this.firstChildMeta.config?.readOnly) {
        delete this.firstChildMeta.config.readOnly;
      }
      if (this.firstChildMeta?.type === 'Dropdown') {
        this.firstChildMeta.config.datasource.source = this.rawViewMetadata.config?.parameters
          ? this.dropDownDataSource
          : '@DATASOURCE '.concat(this.refList).concat('.pxResults');
      } else if (this.firstChildMeta?.type === 'AutoComplete') {
        this.firstChildMeta.config.datasource = this.refList;

        /* Insert the parameters to the component only if present */
        if (this.rawViewMetadata.config?.parameters) {
          this.firstChildMeta.config.parameters = this.parameters;
        }
      }
      // set displayMode conditionally
      if (!this.canBeChangedInReviewMode) {
        this.firstChildMeta.config.displayMode = displayMode;
      }
      if (this.firstChildMeta.type === 'SimpleTableSelect' && this.selectionMode === SELECTION_MODE.MULTI) {
        this.propName = PCore.getAnnotationUtils().getPropertyName(this.firstChildMeta.config.selectionList);
      } else {
        this.propName = PCore.getAnnotationUtils().getPropertyName(this.firstChildMeta.config.value);
      }

      this.generateChildrenToRender();
    }
  }

  updatePropertiesFromProps(theConfigProps) {
    const label = theConfigProps.label;
    const showLabel = theConfigProps.showLabel;
    this.referenceType = theConfigProps.referenceType;
    this.selectionMode = theConfigProps.selectionMode;
    this.parameters = theConfigProps.parameters;
    this.hideLabel = theConfigProps.hideLabel;

    this.propsToUse = { label, showLabel, ...this.pConn$.getInheritedProps() };
    if (this.propsToUse.showLabel === false) {
      this.propsToUse.label = '';
    }
  }

  generateChildrenToRender() {
    const theRecreatedFirstChild = this.recreatedFirstChild();
    const viewsRegion = this.rawViewMetadata.children[1];
    if (viewsRegion?.name === 'Views' && viewsRegion.children.length) {
      this.childrenToRender = [theRecreatedFirstChild, ...this.children.slice(1)];
    } else {
      this.childrenToRender = [theRecreatedFirstChild];
    }
  }

  handleSelection(event) {
    const caseKey = this.pConn$.getCaseInfo().getKey();
    const refreshOptions = { autoDetectRefresh: true };
    if (this.canBeChangedInReviewMode && this.pConn$.getValue('__currentPageTabViewName')) {
      this.pConn$.getActionsApi().refreshCaseView(caseKey, this.pConn$.getValue('__currentPageTabViewName'), '', refreshOptions);
      PCore.getDeferLoadManager().refreshActiveComponents(this.pConn$.getContextName());
    } else {
      const pgRef = this.pConn$.getPageReference().replace('caseInfo.content', '');
      this.pConn$.getActionsApi().refreshCaseView(caseKey, this.viewName, pgRef, refreshOptions);
    }

    // AutoComplete sets value on event.id whereas Dropdown sets it on event.target.value
    const propValue = event?.id || event?.target?.value;
    if (propValue && this.canBeChangedInReviewMode && this.isDisplayModeEnabled) {
      PCore.getDataApiUtils()
        .getCaseEditLock(caseKey, '')
        .then(caseResponse => {
          const pageTokens = this.pConn$.getPageReference().replace('caseInfo.content', '').split('.');
          let curr = {};
          const commitData = curr;

          pageTokens.forEach(el => {
            if (el !== '') {
              curr[el] = {};
              curr = curr[el];
            }
          });

          // expecting format like {Customer: {pyID:"C-100"}}
          const propArr = this.propName.split('.');
          propArr.forEach((element, idx) => {
            if (idx + 1 === propArr.length) {
              curr[element] = propValue;
            } else {
              curr[element] = {};
              curr = curr[element];
            }
          });

          PCore.getCaseUtils()
            .updateCaseEditFieldsData(caseKey, { [caseKey]: commitData }, caseResponse.headers.etag, this.pConn$.getContextName())
            .then(response => {
              PCore.getContainerUtils().updateParentLastUpdateTime(this.pConn$.getContextName(), response.data.data.caseInfo.lastUpdateTime);
              PCore.getContainerUtils().updateRelatedContextEtag(this.pConn$.getContextName(), response.headers.etag);
            });
        });
    }
  }

  // Re-create first child with overridden props
  // Memoized child in order to stop unmount and remount of the child component when data reference
  // rerenders without any actual change
  recreatedFirstChild() {
    const { type, config } = this.firstChildMeta;
    if (this.firstChildMeta?.type !== 'Region') {
      this.pConn$.clearErrorMessages({
        property: this.propName,
        category: '',
        context: ''
      });
      if (!this.canBeChangedInReviewMode && this.isDisplayModeEnabled && this.selectionMode === SELECTION_MODE.SINGLE) {
        this.displaySingleRef = true;
      }

      if (this.isDisplayModeEnabled && this.selectionMode === SELECTION_MODE.MULTI) {
        this.displayMultiRef = true;
      }

      // In the case of a datasource with parameters you cannot load the dropdown before the parameters
      if (type === 'Dropdown' && this.rawViewMetadata.config?.parameters && this.dropDownDataSource === null) {
        return null;
      }

      return this.firstChildPConnect().createComponent({
        type,
        config: {
          ...config,
          required: this.propsToUse.required,
          visibility: this.propsToUse.visibility,
          disabled: this.propsToUse.disabled,
          label: this.propsToUse.label,
          viewName: this.pConn$.getCurrentView(),
          parameters: this.rawViewMetadata.config.parameters,
          readOnly: false,
          localeReference: this.rawViewMetadata.config.localeReference,
          ...(this.selectionMode === SELECTION_MODE.SINGLE ? { referenceType: this.referenceType } : ''),
          dataRelationshipContext:
            this.rawViewMetadata.config.contextClass && this.rawViewMetadata.config.name ? this.rawViewMetadata.config.name : null,
          hideLabel: this.hideLabel,
          onRecordChange: this.handleSelection.bind(this)
        }
      });
    }
  }
}
