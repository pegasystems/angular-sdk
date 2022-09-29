import { Component, OnInit, Input } from '@angular/core';
import { AngularPConnectService } from "../../../_bridge/angular-pconnect";
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-simple-table-select',
    templateUrl: './simple-table-select.component.html',
    styleUrls: ['./simple-table-select.component.scss']
})
export class SimpleTableSelectComponent implements OnInit {

    constructor(private angularPConnect: AngularPConnectService) { }

    @Input() pConn$: any;
    @Input() formGroup$: FormGroup;

    // Used with AngularPConnect
    angularPConnectData: any = {};
    PCore$: any;

    label = "";
    renderMode = "";
    showLabel = true;
    viewName = "";
    parameters = {};
    dataRelationshipContext = "";
    propsToUse;
    showSimpleTableManual: boolean;
    isSearchable: boolean;
    filters: any;
    listViewProps: any;
    pageClass: any;
    ngOnInit(): void {
        if (!this.PCore$) {
            this.PCore$ = window.PCore;
        }

        // First thing in initialization is registering and subscribing to the AngularPConnect service
        this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);
        this.updateSelf();
    }

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
        const theConfigProps = this.pConn$.getConfigProps();
        this.label = theConfigProps.label;
        this.renderMode = theConfigProps.renderMode;
        this.showLabel = theConfigProps.showLabel;
        this.viewName = theConfigProps.viewName;
        this.parameters = theConfigProps.parameters;
        this.dataRelationshipContext = theConfigProps.dataRelationshipContext;

        this.propsToUse = {label: this.label, showLabel: this.showLabel, ...this.pConn$.getInheritedProps()};

        if (this.propsToUse.showLabel === false) {
            this.propsToUse.label = "";
        }
        const { MULTI } = this.PCore$.getConstants().LIST_SELECTION_MODE;
        const { selectionMode, selectionList } = this.pConn$.getConfigProps();
        const isMultiSelectMode = selectionMode === MULTI;
        if (isMultiSelectMode && this.renderMode === 'ReadOnly') {
            this.showSimpleTableManual = true;
        } else {
            const pageReference = this.pConn$.getPageReference();
            let referenceProp = isMultiSelectMode ? selectionList.substring(1) : pageReference.substring(pageReference.lastIndexOf('.') + 1);
            // Replace here to use the context name instead
            let contextPageReference = null;
            if (this.dataRelationshipContext !== null && selectionMode === 'single') {
                referenceProp = this.dataRelationshipContext;
                contextPageReference = pageReference.concat('.').concat(referenceProp);
            }
            const metadata = isMultiSelectMode ? this.pConn$.getFieldMetadata(`@P .${referenceProp}`) : this.pConn$.getCurrentPageFieldMetadata(contextPageReference);

            const { datasource: { parameters: fieldParameters = {} } = {}, pageClass } = metadata;

            this.pageClass = pageClass;
            const compositeKeys: Array<any> = [];
            Object.values(fieldParameters).forEach((param: any) => {
                if (this.isSelfReferencedProperty(param, referenceProp)) {
                    compositeKeys.push(param.substring(param.lastIndexOf('.') + 1));
                }
            });

            this.processFiltrers(theConfigProps, compositeKeys);
        }
        
    }

    processFiltrers(theConfigProps, compositeKeys) {
        const defaultRowHeight = "2";

        const additionalTableConfig = {
            rowDensity: false,
            enableFreezeColumns: false,
            autoSizeColumns: false,
            resetColumnWidths: false,
            defaultFieldDef: {
                showMenu: false,
                noContextMenu: true,
                grouping: false
            },
            itemKey: "$key",
            defaultRowHeight
        };

        this.listViewProps = {
            ...theConfigProps,
            title: this.propsToUse.label,
            personalization: false,
            grouping: false,
            expandGroups: false,
            reorderFields: false,
            showHeaderIcons: false,
            editing: false,
            globalSearch: true,
            toggleFieldVisibility: false,
            basicMode: true,
            additionalTableConfig,
            compositeKeys,
            viewName: this.viewName,
            parameters: this.parameters
        };

        this.filters = this.pConn$.getRawMetadata().config.promotedFilters ?? [];

        this.isSearchable = this.filters.length > 0;
    }

    isSelfReferencedProperty(param, referenceProp) {
        const [, parentPropName] = param.split('.');
        return parentPropName === referenceProp;
    };

}