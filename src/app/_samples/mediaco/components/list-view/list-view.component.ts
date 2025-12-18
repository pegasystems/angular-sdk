import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Utils, ListViewComponent as OOTBListViewComponent } from '@pega/angular-sdk-components';
import { CarouselComponent } from '../carousel/carousel.component';
import { GalleryGridComponent } from '../gallery-grid/gallery-grid.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { init } from './listViewHelpers';

interface ListViewProps {
  inheritedProps: any;
  title: string | undefined;
  // If any, enter additional props that only exist on this component
  globalSearch?: boolean;
  referenceList?: any;
  rowClickAction?: any;
  selectionMode?: string;
  referenceType?: string;
  compositeKeys?: any;
  showDynamicFields?: boolean;
  presets?: any;
  reorderFields: string | boolean;
  grouping: string | boolean;
  value: any;
  readonlyContextList: any;
  label?: string;
  displayAs?: string;
  showRecords: boolean;
  viewName?: string;
}

@Component({
  selector: 'mediaco-list-view',
  imports: [CommonModule, CarouselComponent, OOTBListViewComponent, MatIconButton, MatIcon],
  templateUrl: './list-view.component.html',
  styleUrl: './list-view.component.scss',
  providers: [Utils]
})
export class ListViewComponent implements OnInit {
  @Input() pConn$: typeof PConnect;
  @Input() bInForm$ = true;

  configProps$: ListViewProps;
  template: string;
  sourceList: any[];
  referenceDataPage: string;
  caseTypeToActivityMap: any;
  title: string;
  payload: any;
  listContext: any = {};
  ref: any = {};
  showDynamicFields: boolean | undefined;
  cosmosTableRef: any;
  selectionMode: string | undefined;
  fieldDefs: any;
  columns: any[];

  constructor(
    public utils: Utils,
    private dialog: MatDialog
  ) {
    this.caseTypeToActivityMap = {
      'Plan Upgrade': 'Plan Upgrade',
      Payment: 'Make Payment',
      AddOnPurchase: 'Add-On Services',
      'New Statement': 'New Service',
      ProfileUpdated: 'Get Help',
      'Product Demo': 'Purchase Phone'
    };
  }

  ngOnInit(): void {
    this.configProps$ = this.pConn$.getConfigProps() as ListViewProps;
    this.template = this.configProps$.presets[0]?.template;
    this.title = this.configProps$.title || '';
    this.showDynamicFields = this.configProps$?.showDynamicFields;
    this.selectionMode = this.configProps$.selectionMode;

    if (this.configProps$) {
      if (!this.payload) {
        this.payload = { referenceList: this.configProps$.referenceList };
      }
      init({
        pConn$: this.pConn$,
        bInForm$: this.bInForm$,
        ...this.payload,
        listContext: this.listContext,
        ref: this.ref,
        showDynamicFields: this.showDynamicFields,
        cosmosTableRef: this.cosmosTableRef,
        selectionMode: this.selectionMode
      }).then(response => {
        this.listContext = response;
        this.getListData();
      });
    }
  }

  getListData() {
    this.fieldDefs = this.listContext.meta.fieldDefs;
    this.referenceDataPage = this.configProps$.referenceList;
    const componentConfig = this.pConn$.getComponentConfig();
    const columnFields = componentConfig.presets[0].children[0].children;
    this.columns = this.getHeaderCells(columnFields, this.fieldDefs);
    PCore.getDataPageUtils()
      .getDataAsync(this.referenceDataPage, this.pConn$.getContextName())
      .then(({ data }) => {
        this.modifyListData(data);
      });
  }

  modifyListData(data: any[]) {
    if (this.referenceDataPage === 'D_AccountHistoryList') {
      this.sourceList = data.map(item => {
        const caseType = this.caseTypeToActivityMap[item.ActivityType];
        return {
          icon: this.utils.getImageSrc(this.getIcon(caseType), this.utils.getSDKStaticContentUrl()),
          title: this.columns[0] ? item[this.columns[0]?.id] : undefined,
          title_subtext: this.columns[2] ? this.timeSince(new Date(item[this.columns[2]?.id] || item.pxCreateDateTime)) : undefined,
          description: this.columns[1] ? item[this.columns[1]?.id] : undefined
        };
      });
      return;
    }
    if (this.referenceDataPage === 'D_TrendingItemsList') {
      this.sourceList = data.map((item, index) => {
        return {
          number: index + 1,
          title: this.columns[0] ? item[this.columns[0]?.id] : undefined,
          description: this.columns[1] ? item[this.columns[1]?.id] : undefined,
          description_subtext: this.columns[2] ? item[this.columns[2]?.id] + ' views' : undefined,
          rating: item[this.columns[3]?.id]
        };
      });
      return;
    }
    if (this.referenceDataPage === 'D_CarouselitemList') {
      this.sourceList = data.map(item => {
        return {
          Carouselheading: item.Carouselheading,
          ImageURL: item.ImageURL
        };
      });
      return;
    }
  }

  get isFromCaseView() {
    return !['D_AccountHistoryList', 'D_TrendingItemsList', 'D_CarouselitemList'].includes(this.referenceDataPage);
  }

  getIcon(activityType: string): string {
    switch (activityType) {
      case 'Plan Upgrade':
        return 'trending-up';
      case 'Make Payment':
        return 'wallet';
      case 'Add-On Services':
        return 'monitor';
      case 'New Service':
        return 'shopping-cart';
      case 'Get Help':
        return 'headphones';
      case 'Purchase Phone':
        return 'smartphone';
      default:
        return '';
    }
  }

  timeSince(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) {
      return Math.floor(interval) + 'y ago';
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + ' months ago';
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + 'd ago';
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + 'h ago';
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + 'm ago';
    }
    return Math.floor(seconds) + 's ago';
  }

  openShowAll() {
    this.dialog.open(GalleryGridComponent, {
      width: '60vw',
      height: '70vh',
      maxWidth: '95vw',
      maxHeight: '95vh',

      data: {
        dataPage: this.referenceDataPage,
        items: this.sourceList
      }
    });
  }

  private getHeaderCells(colFields, fields) {
    const AssignDashObjects = ['Assign-Worklist', 'Assign-WorkBasket'];
    return colFields.map((field: any, index) => {
      let theField = field.config.value.substring(field.config.value.indexOf(' ') + 1);
      if (theField.indexOf('.') === 0) {
        theField = theField.substring(1);
      }
      const colIndex = fields.findIndex(ele => ele.name === theField);
      const displayAsLink = field.config.displayAsLink;
      const headerRow: any = {};
      headerRow.id = fields[index].id;
      headerRow.type = field.type;
      headerRow.displayAsLink = displayAsLink;
      headerRow.numeric = field.type === 'Decimal' || field.type === 'Integer' || field.type === 'Percentage' || field.type === 'Currency' || false;
      headerRow.disablePadding = false;
      headerRow.label = fields[index].label;
      if (colIndex > -1) {
        headerRow.classID = fields[colIndex].classID;
      }
      if (displayAsLink) {
        headerRow.isAssignmentLink = AssignDashObjects.includes(headerRow.classID);
        if (field.config.value?.startsWith('@CA')) {
          headerRow.isAssociation = true;
        }
      }
      return headerRow;
    });
  }
}
