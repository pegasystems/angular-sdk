import { Component, OnInit, Input } from '@angular/core';
import { AngularPConnectService } from "../../../_bridge/angular-pconnect";
import { FormGroup } from '@angular/forms';
const SELECTION_MODE = { SINGLE: 'single', MULTI: 'multi' };
@Component({
    selector: 'app-data-reference',
    templateUrl: './data-reference.component.html',
    styleUrls: ['./data-reference.component.scss']
})
export class DataReferenceComponent implements OnInit {

    constructor(private angularPConnect: AngularPConnectService) { }

    @Input() pConn$: any;
    @Input() formGroup$: FormGroup;
    arFields$: Array<any> = [];

    label;
    showLabel;
    displayMode = "";
    allowAndPersistChangesInReviewMode = false;
    referenceType = "";
    selectionMode = "";
    displayAs = "";
    ruleClass = "";
    parameters;
    hideLabel = false;

    // Used with AngularPConnect
    angularPConnectData: any = {};
    PCore$: any;
    childrenToRender: Array<any> = [];
    dropDownDataSource: String = "";
    isDisplayModeEnabled: Boolean = false;
    propsToUse: any = {};
    rawViewMetadata: any = {};
    viewName: String = "";
    firstChildMeta: any = {};
    refList: any;
    canBeChangedInReviewMode: Boolean = false;
    propName: String = ""
    firstChildPConnect;
    children;
    displaySingleRef: boolean;
    displayMultiRef: boolean;
    ngOnInit(): void {
        if (!this.PCore$) {
            this.PCore$ = window.PCore;
        }

        // First thing in initialization is registering and subscribing to the AngularPConnect service
        this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);
        this.children = this.pConn$.getChildren();
        this.updateSelf();
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
        this.label = theConfigProps.label;
        this.showLabel = theConfigProps.showLabel;
        this.displayMode = theConfigProps.displayMode;
        this.allowAndPersistChangesInReviewMode = theConfigProps.allowAndPersistChangesInReviewMode;
        this.referenceType = theConfigProps.referenceType;
        this.selectionMode = theConfigProps.selectionMode;
        this.displayAs = theConfigProps.displayAs;
        this.ruleClass = theConfigProps.ruleClass;
        this.parameters = theConfigProps.parameters;
        this.hideLabel = theConfigProps.hideLabel;

        this.propsToUse = { label: this.label, showLabel: this.showLabel, ...this.pConn$.getInheritedProps() };
        if (this.propsToUse.showLabel === false) {
            this.propsToUse.label = '';
        }
        this.rawViewMetadata = this.pConn$.getRawMetadata();
        this.viewName = this.rawViewMetadata.name;
        this.firstChildMeta = this.rawViewMetadata.children[0];
        this.refList = this.rawViewMetadata.config.referenceList;
        this.canBeChangedInReviewMode = this.allowAndPersistChangesInReviewMode && (this.displayAs === 'autocomplete' || this.displayAs === 'dropdown');
        // this.childrenToRender = this.children;
        this.isDisplayModeEnabled = ["LABELS_LEFT", "STACKED_LARGE_VAL"].includes(this.displayMode);

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
                this.firstChildMeta.config.displayMode = this.displayMode;
            }
            if (this.firstChildMeta.type === 'SimpleTableSelect' && this.selectionMode === SELECTION_MODE.MULTI) {
                this.propName = this.PCore$.getAnnotationUtils().getPropertyName(this.firstChildMeta.config.selectionList);
            } else {
                this.propName = this.PCore$.getAnnotationUtils().getPropertyName(this.firstChildMeta.config.value);
            }

            const theRecreatedFirstChild = this.recreatedFirstChild();
            const viewsRegion = this.rawViewMetadata.children[1];
            if (viewsRegion?.name === 'Views' && viewsRegion.children.length) {
              this.childrenToRender = [theRecreatedFirstChild, ...this.children.slice(1)];
            } else {
              this.childrenToRender = [theRecreatedFirstChild];
            }
        }
    }

    handleSelection(event) {
        const caseKey = this.pConn$.getCaseInfo().getKey();
        const refreshOptions = { autoDetectRefresh: true };
        if (this.canBeChangedInReviewMode && this.pConn$.getValue('__currentPageTabViewName')) {
            this.pConn$
                .getActionsApi()
                .refreshCaseView(caseKey, this.pConn$.getValue('__currentPageTabViewName'), null, refreshOptions);
            this.PCore$.getDeferLoadManager().refreshActiveComponents(this.pConn$.getContextName());
        } else {
            const pgRef = this.pConn$.getPageReference().replace('caseInfo.content', '');
            this.pConn$.getActionsApi().refreshCaseView(caseKey, this.viewName, pgRef, refreshOptions);
        }

        // AutoComplete sets value on event.id whereas Dropdown sets it on event.target.value
        const propValue = event?.id || event?.target.value;
        if (propValue && this.canBeChangedInReviewMode && this.isDisplayModeEnabled) {
            this.PCore$.getDataApiUtils()
                .getCaseEditLock(caseKey)
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

                    this.PCore$.getDataApiUtils()
                        .updateCaseEditFieldsData(
                            caseKey,
                            { [caseKey]: commitData },
                            caseResponse.headers.etag,
                            this.pConn$.getContextName()
                        )
                        .then(response => {
                            this.PCore$.getContainerUtils().updateChildContainersEtag(
                                this.pConn$.getContextName(),
                                response.headers.etag
                            );
                        });
                });
        }
    };

    // Re-create first child with overridden props
    // Memoized child in order to stop unmount and remount of the child component when data reference
    // rerenders without any actual change
    recreatedFirstChild() {
        const { type, config } = this.firstChildMeta;
        if (this.firstChildMeta?.type !== 'Region') {
            this.pConn$.clearErrorMessages({
                property: this.propName
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
                    dataRelationshipContext: this.rawViewMetadata.config.contextClass && this.rawViewMetadata.config.name ? this.rawViewMetadata.config.name : null,
                    hideLabel: this.hideLabel,
                    onRecordChange: this.handleSelection
                }
            });
        }
    }

}