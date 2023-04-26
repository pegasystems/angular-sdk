import { Component, OnInit, Input } from '@angular/core';
import { AngularPConnectService } from "../../../_bridge/angular-pconnect";
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-promoted-filters',
  templateUrl: './promoted-filters.component.html',
  styleUrls: ['./promoted-filters.component.scss']
})
export class PromotedFiltersComponent implements OnInit {
  showFilters: boolean;

  constructor(private angularPConnect: AngularPConnectService) { }

  angularPConnectData: any = {};
  PCore$: any;
  @Input() viewName;
  @Input() filters;
  @Input() listViewProps;
  @Input() pageClass;
  @Input() pConn$: any;
  @Input() formGroup$: FormGroup;
  @Input() parameters = {};
  localeCategory = 'SimpleTable';
  localizedVal;
  filtersProperties = {};
  showTable;
  transientItemID;
  processedFilters = [];
  payload = {};
  SUPPORTED_TYPES_IN_PROMOTED_FILTERS = [
    'TextInput',
    'Percentage',
    'Email',
    'Integer',
    'Decimal',
    'Checkbox',
    'DateTime',
    'Date',
    'Time',
    'Text',
    'TextArea',
    'Currency',
    'URL',
    'RichText'
  ];

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
    this.localizedVal = this.PCore$.getLocaleUtils().getLocaleValue;
    this.filters.forEach((filter) => {
      this.filtersProperties[this.PCore$.getAnnotationUtils().getPropertyName(filter.config.value)] = '';
    });

    const filtersWithClassID = {...this.filtersProperties, classID: this.pageClass};
    this.transientItemID = this.pConn$.getContainerManager().addTransientItem({id: this.viewName, data: filtersWithClassID});
    this.processedFilters = [];
    this.filters.map((filter) => {
      const filterClone = { ...filter };
      // convert any field which is not supported to TextInput and delete the placeholder as it may contain placeholder specific to original type.
      if (!this.SUPPORTED_TYPES_IN_PROMOTED_FILTERS.includes(filterClone.type)) {
        filterClone.type = 'TextInput';
        delete filterClone.config.placeholder;
      }
      filterClone.config.contextName = this.transientItemID;
      filterClone.config.readOnly = false;
      filterClone.config.context = this.transientItemID;
      filterClone.config.localeReference = this.listViewProps.localeReference;
      const c11nEnv = this.PCore$.createPConnect({
        meta: filterClone,
        options: {
          hasForm: true,
          contextName: this.transientItemID
        }
      });
      this.processedFilters.push(c11nEnv);
    });
    this.showFilters = true;
  }

  formatPromotedFilters(promotedFilters) {
    return Object.entries(promotedFilters).reduce((acc, [field, value]) => {
      if (value) {
        acc[field] = {
          lhs: {
            field
          },
          comparator: "EQ",
          rhs: {
            value
          }
        };
      }
      return acc;
    }, {});
  }

  isValidInput(input) {
    return Object.values(input).findIndex((v) => v) >= 0;
  }

  getFilterData() {
    const changes = this.PCore$.getFormUtils().getChanges(this.transientItemID);
    const formValues = {};
    Object.keys(changes).forEach((key) => {
      if (!['context_data', 'pageInstructions'].includes(key)) {
        formValues[key] = changes[key];
      }
    });
    const promotedFilters = this.formatPromotedFilters(formValues);
    if (this.PCore$.getFormUtils().isFormValid(this.transientItemID) && this.isValidInput(formValues)) {
      this.showTable = true;
      const Query: any = {
        dataViewParameters: this.parameters || {}
      };

      if (Object.keys(promotedFilters).length > 0) {
        Query.query = { filter: { filterConditions: promotedFilters } };
      }
      this.payload = Query;
    }
  }

  clearFilterData() {
    this.PCore$.getContainerUtils().clearTransientData(this.transientItemID);
    this.showTable = false;
    this.pConn$?.getListActions?.()?.setSelectedRows([]); // Clear the selection (if any made by user)
  }

}