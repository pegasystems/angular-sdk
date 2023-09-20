import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { AngularPConnectService } from '@pega/angular-sdk-library';
import { getTransientTabs, getVisibleTabs, tabClick } from '@pega/angular-sdk-library';
import { ComponentMapperComponent } from '@pega/angular-sdk-library';

declare const window: any;

@Component({
  selector: 'app-details-sub-tabs',
  templateUrl: './details-sub-tabs.component.html',
  styleUrls: ['./details-sub-tabs.component.scss'],
  standalone: true,
  imports: [MatTabsModule, CommonModule, forwardRef(() => ComponentMapperComponent)]
})
export class DetailsSubTabsComponent implements OnInit {
  @Input() pConn$: any;
  @Input() formGroup$: FormGroup;

  configProps$: Object;
  arChildren$: Array<any>;
  angularPConnectData: any = {};
  PCore$: any;
  defaultTabIndex = 0;
  currentTabId = this.defaultTabIndex.toString();
  tabItems: Array<any>;
  availableTabs: any;
  constructor(private angularPConnect: AngularPConnectService) {}

  ngOnInit(): void {
    // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);
    if (!this.PCore$) {
      this.PCore$ = window.PCore;
    }
    this.checkAndUpdate();
  }

  ngOnDestroy() {
    if (this.angularPConnectData.unsubscribeFn) {
      this.angularPConnectData.unsubscribeFn();
    }
  }

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

  updateSelf() {
    const children = this.pConn$?.getChildren();
    const deferLoadedTabs = children[0];
    this.availableTabs = getVisibleTabs(deferLoadedTabs, 'tabsSubs');
    this.updateTabContent();
  }

  updateTabContent() {
    const tempTabItems = getTransientTabs(this.availableTabs, this.currentTabId, this.tabItems);
    this.tabItems = tempTabItems;
  }

  handleTabClick(event) {
    const { index } = event;
    this.currentTabId = index.toString();
    tabClick(index, this.availableTabs, this.currentTabId, this.tabItems);
    const tempTabItems = getTransientTabs(this.availableTabs, this.currentTabId, this.tabItems);
    this.tabItems[index].content = tempTabItems[index].content;
  }
}
