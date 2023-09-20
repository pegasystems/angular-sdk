import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { AngularPConnectService } from '@pega/angular-sdk-library';
import { FieldGroupUtils } from '@pega/angular-sdk-library';
import { Utils } from '@pega/angular-sdk-library';
import { RegionComponent } from '@pega/angular-sdk-library';
import { ComponentMapperComponent } from '@pega/angular-sdk-library';

declare const window: any;

@Component({
  selector: 'app-field-group-template',
  templateUrl: './field-group-template.component.html',
  styleUrls: ['./field-group-template.component.scss'],
  standalone: true,
  imports: [CommonModule, MatButtonModule, ComponentMapperComponent, forwardRef(() => RegionComponent)]
})
export class FieldGroupTemplateComponent implements OnInit {
  @Input() configProps$: any;
  @Input() pConn$: any;
  @Input() formGroup$: FormGroup;

  PCore$: any;

  angularPConnectData: any = {};
  inheritedProps$: Object;
  showLabel$: boolean = true;
  label$: string;
  readonlyMode: boolean;
  contextClass: any;
  referenceList: any;
  pageReference: any;
  heading: any;
  children: any;
  menuIconOverride$: any;
  prevRefLength: number;
  allowAddEdit: boolean;
  fieldHeader: any;

  constructor(private angularPConnect: AngularPConnectService, private utils: Utils, private fieldGroupUtils: FieldGroupUtils) {}

  ngOnInit(): void {
    // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);
    this.updateSelf();

    let menuIconOverride$ = 'trash';
    if (menuIconOverride$) {
      this.menuIconOverride$ = this.utils.getImageSrc(menuIconOverride$, this.utils.getSDKStaticContentUrl());
    }
  }

  ngOnDestroy(): void {
    if (this.angularPConnectData.unsubscribeFn) {
      this.angularPConnectData.unsubscribeFn();
    }
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

  ngOnChanges(changes) {
    if (!this.PCore$) {
      this.PCore$ = window.PCore;
    }

    if (changes && changes.configProps$) {
      const props = changes.configProps$;
      if (props.currentValue !== props.previousValue) {
        this.configProps$ = props.currentValue;
        if (changes?.pConn$?.currentValue) {
          this.pConn$ = changes?.pConn$?.currentValue;
        }
        this.updateSelf();
      }
    }
  }

  updateSelf() {
    this.inheritedProps$ = this.pConn$.getInheritedProps();
    this.label$ = this.configProps$['label'];
    this.showLabel$ = this.configProps$['showLabel'];
    // label & showLabel within inheritedProps takes precedence over configProps
    this.label$ = this.inheritedProps$['label'] || this.label$;
    this.showLabel$ = this.inheritedProps$['showLabel'] || this.showLabel$;

    this.allowAddEdit = this.configProps$['allowTableEdit'];

    const renderMode = this.configProps$['renderMode'];
    const displayMode = this.configProps$['displayMode'];
    this.readonlyMode = renderMode === 'ReadOnly' || displayMode === 'LABELS_LEFT';
    this.contextClass = this.configProps$['contextClass'];
    const lookForChildInConfig = this.configProps$['lookForChildInConfig'];
    this.heading = this.configProps$['heading'] ?? 'Row';
    this.fieldHeader = this.configProps$['fieldHeader'];
    const resolvedList = this.fieldGroupUtils.getReferenceList(this.pConn$);
    this.pageReference = `${this.pConn$.getPageReference()}${resolvedList}`;
    this.pConn$.setReferenceList(resolvedList);
    if (this.readonlyMode) {
      this.pConn$.setInheritedProp('displayMode', 'LABELS_LEFT');
    }
    this.referenceList = this.configProps$['referenceList'];
    if (this.prevRefLength != this.referenceList.length) {
      if (!this.readonlyMode) {
        if (this.referenceList?.length === 0 && this.allowAddEdit !== false) {
          this.addFieldGroupItem();
        }
      }
      let children: any = [];
      this.referenceList?.map((item, index) => {
        children.push({
          id: index,
          name: this.fieldHeader === 'propertyRef' ? this.getDynamicHeader(item, index) : this.getStaticHeader(this.heading, index),
          children: this.fieldGroupUtils.buildView(this.pConn$, index, lookForChildInConfig)
        });
      });
      this.children = children;
    }
    this.prevRefLength = this.referenceList.length;
  }

  getStaticHeader = (heading, index) => {
    return `${heading} ${index + 1}`;
  };

  getDynamicHeader = (item, index) => {
    if (this.fieldHeader === 'propertyRef' && this.heading && item[this.heading.substring(1)]) {
      return item[this.heading.substring(1)];
    }
    return `Row ${index + 1}`;
  };

  addFieldGroupItem() {
    if (this.PCore$?.getPCoreVersion()?.includes('8.7')) {
      this.pConn$.getListActions().insert({ classID: this.contextClass }, this.referenceList.length, this.pageReference);
    } else {
      this.pConn$.getListActions().insert({ classID: this.contextClass }, this.referenceList.length);
    }
  }

  deleteFieldGroupItem(index) {
    if (this.PCore$?.getPCoreVersion()?.includes('8.7')) {
      this.pConn$.getListActions().deleteEntry(index, this.pageReference);
    } else {
      this.pConn$.getListActions().deleteEntry(index);
    }
  }
}
