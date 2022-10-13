import { Component, OnInit, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Utils } from "../../../_helpers/utils";
import { AngularPConnectService } from "../../../_bridge/angular-pconnect";

@Component({
  selector: "app-simple-table",
  templateUrl: "./simple-table.component.html",
  styleUrls: ["./simple-table.component.scss"],
})
export class SimpleTableComponent implements OnInit {
  @Input() pConn$: any;
  @Input() formGroup$: FormGroup;

  bVisible$: boolean = true;

  configProps$: any;
  angularPConnectData: any = {};
  PCore$: any;
  fieldGroupProps: any;
  constructor(
    private angularPConnect: AngularPConnectService,
    private utils: Utils
  ) {}

  ngOnInit(): void {
    // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);
    if (!this.PCore$) {
      this.PCore$ = window.PCore;
    }
    // Then, continue on with other initialization

    // call checkAndUpdate when initializing
    this.checkAndUpdate();
  }

  ngOnDestroy(): void {
    if (this.angularPConnectData.unsubscribeFn) {
      this.angularPConnectData.unsubscribeFn();
    }
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
    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());

    if (this.configProps$["visibility"] != null) {
      // eslint-disable-next-line no-multi-assign
      this.bVisible$ = this.bVisible$ = this.utils.getBooleanValue(this.configProps$["visibility"]);
    }

    const { multiRecordDisplayAs } = this.configProps$;
    let { contextClass } = this.configProps$;
    if (!contextClass) {
      let listName = this.pConn$.getComponentConfig().referenceList;
      listName = this.PCore$.getAnnotationUtils().getPropertyName(listName);
      contextClass = this.pConn$.getFieldMetadata(listName)?.pageClass;
    }
    if(multiRecordDisplayAs === "fieldGroup") {
      this.fieldGroupProps = {...this.configProps$, contextClass};
    }
  }

  // Callback passed when subscribing to store change
  onStateChange() {
    this.checkAndUpdate();
  }
}
