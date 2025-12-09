import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { Utils } from '@pega/angular-sdk-components/src/public-api';
import { Utils } from '@pega/angular-sdk-components';
import { CarouselComponent } from '../carousel/carousel.component';
import { GalleryGridComponent } from '../gallery-grid/gallery-grid.component';
import { MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

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
  selector: 'app-list-view',
  imports: [CommonModule, CarouselComponent, MatButton],
  templateUrl: './list-view.component.html',
  styleUrl: './list-view.component.scss',
  providers: [Utils]
})
export class ListViewComponent implements OnInit {
  @Input() pConn$: typeof PConnect;
  @Input() bInForm$ = true;
  @Input() payload;
  configProps$: ListViewProps;
  template: string;
  sourceList: any[];
  referenceDataPage: string;
  caseTypeToActivityMap: any;
  title: string;

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
    this.getListData();
  }

  getListData() {
    this.referenceDataPage = this.configProps$.referenceList;
    PCore.getDataPageUtils()
      .getDataAsync(this.referenceDataPage, this.pConn$.getContextName())
      .then(({ data }) => {
        this.modifyListData(data);
        console.log(data);
      });
  }

  modifyListData(data: any[]) {
    if (this.referenceDataPage === 'D_AccountHistoryList') {
      this.sourceList = data.map(item => {
        const caseType = this.caseTypeToActivityMap[item.ActivityType];
        return {
          icon: this.utils.getImageSrc(this.getIcon(caseType), this.utils.getSDKStaticContentUrl()),
          title: item.ActivityType,
          title_subtext: this.timeSince(new Date(item.pxUpdateDateTime || item.pxCreateDateTime)),
          description: item.Description
        };
      });
      return;
    }
    if (this.referenceDataPage === 'D_TrendingItemsList') {
      this.sourceList = data.map((item, index) => {
        return {
          number: index + 1,
          title: item.Name,
          description: item.Genere,
          description_subtext: item.Views + ' views',
          rating: item.Rating
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
}
