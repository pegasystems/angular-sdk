import { Component, OnInit, Input } from "@angular/core";
import { AngularPConnectService } from "../../../_bridge/angular-pconnect";
import { FieldGroupUtils } from "../../../_helpers/field-group-utils";
import { FormGroup } from "@angular/forms";
import { Utils } from "../../../_helpers/utils";

@Component({
  selector: "app-field-group-template",
  templateUrl: "./field-group-template.component.html",
  styleUrls: ["./field-group-template.component.scss"],
})
export class FieldGroupTemplateComponent implements OnInit {
  constructor(
    private angularPConnect: AngularPConnectService,
    private utils: Utils,
    private fieldGroupUtils: FieldGroupUtils
  ) {}

  @Input() configProps$: any;
  @Input() pConn$: any;
  @Input() formGroup$: FormGroup;
  angularPConnectData: any = {};
  label: string;
  readonlyMode: boolean;
  contextClass: any;
  referenceList: any;
  pageReference: any;
  heading: any;
  children: any;
  PCore$: any;
  menuIconOverride$: any;
  prevRefLength: number;
  allowAddEdit: boolean;
  fieldHeader: any;
  ngOnInit(): void {
    // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData =
      this.angularPConnect.registerAndSubscribeComponent(
        this,
        this.onStateChange
      );
    this.updateSelf();

    let menuIconOverride$ = "trash";
    if (menuIconOverride$) {
      this.menuIconOverride$ = this.utils.getImageSrc(
        menuIconOverride$,
        this.PCore$.getAssetLoader().getStaticServerUrl()
      );
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
    this.label = this.configProps$["label"];
    const renderMode = this.configProps$["renderMode"];
    const displayMode = this.configProps$["displayMode"];
    this.readonlyMode =
      renderMode === "ReadOnly" || displayMode === "LABELS_LEFT";
    this.contextClass = this.configProps$["contextClass"];
    const lookForChildInConfig = this.configProps$["lookForChildInConfig"];
    this.heading = this.configProps$["heading"] ?? "Row";
    this.fieldHeader = this.configProps$["fieldHeader"];
    const resolvedList = this.fieldGroupUtils.getReferenceList(this.pConn$);
    this.pageReference = `${this.pConn$.getPageReference()}${resolvedList}`;
    this.pConn$.setReferenceList(resolvedList);
    this.referenceList = this.configProps$["referenceList"];
    if (this.prevRefLength != this.referenceList.length) {
      if (!this.readonlyMode) {
        if (this.referenceList?.length === 0 && this.allowAddEdit !== false) {
          this.addFieldGroupItem();
        }
        let children: any = [];
        this.referenceList?.map((item, index) => {
          children.push({
            id: index,
            name:
              this.fieldHeader === "propertyRef"
                ? this.getDynamicHeader(item, index)
                : this.getStaticHeader(this.heading, index),
            children: this.fieldGroupUtils.buildView(
              this.pConn$,
              index,
              lookForChildInConfig
            ),
          });
        });
        this.children = children;
      }
    }
    this.prevRefLength = this.referenceList.length;
  }

  getStaticHeader = (heading, index) => {
    return `${heading} ${index + 1}`;
  }

  getDynamicHeader = (item, index) => {
    if (
      this.fieldHeader === "propertyRef" &&
      this.heading &&
      item[this.heading.substring(1)]
    ) {
      return item[this.heading.substring(1)];
    }
    return `Row ${index + 1}`;
  };

  addFieldGroupItem() {
    if (this.PCore$?.getPCoreVersion()?.includes("8.7")) {
      this.pConn$
        .getListActions()
        .insert(
          { classID: this.contextClass },
          this.referenceList.length,
          this.pageReference
        );
    } else {
      this.pConn$
        .getListActions()
        .insert({ classID: this.contextClass }, this.referenceList.length);
    }
  }

  deleteFieldGroupItem(index) {
    if (this.PCore$?.getPCoreVersion()?.includes("8.7")) {
      this.pConn$.getListActions().deleteEntry(index, this.pageReference);
    } else {
      this.pConn$.getListActions().deleteEntry(index);
    }
  }
}
