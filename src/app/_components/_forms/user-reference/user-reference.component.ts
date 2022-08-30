import { Component, OnInit, Input } from "@angular/core";
import { Utils } from "../../../_helpers/utils";
import { AngularPConnectService } from "../../../_bridge/angular-pconnect";
import { FormControl, FormGroup } from "@angular/forms";

const OPERATORS_DP = "D_pyGetOperatorsForCurrentApplication";
const DROPDOWN_LIST = "Drop-down list";
const SEARCH_BOX = "Search box";
@Component({
  selector: "app-user-reference",
  templateUrl: "./user-reference.component.html",
  styleUrls: ["./user-reference.component.scss"],
})
export class UserReferenceComponent implements OnInit {
  @Input() pConn$: any;
  @Input() formGroup$: FormGroup;

  controlName$: string;
  value$;
  userName$: string;
  label$: string;
  userID$: string;
  options$: any;
  bReadonly$: boolean;
  bRequired$: boolean;
  showAsFormattedText$: boolean;
  displayAs$: string;

  angularPConnectData: any = {};

  PCore$: any;

  fieldControl = new FormControl("", null);
  testId: string;

  constructor(
    private angularPConnect: AngularPConnectService,
    private utils: Utils
  ) {}

  ngOnInit(): void {
    if (!this.PCore$) {
      this.PCore$ = window.PCore;
    }

    // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData =
      this.angularPConnect.registerAndSubscribeComponent(
        this,
        this.onStateChange
      );

    this.controlName$ = this.angularPConnect.getComponentID(this);

    this.checkAndUpdate();

    if (this.formGroup$) {
      // add control to formGroup
      this.formGroup$.addControl(this.controlName$, this.fieldControl);
      this.fieldControl.setValue(this.value$);
    }
  }

  ngOnDestroy() {
    if (this.formGroup$) {
      this.formGroup$.removeControl(this.controlName$);
    }

    if (this.angularPConnectData.unsubscribeFn) {
      this.angularPConnectData.unsubscribeFn();
    }
  }

  get type(): string {
    if (this.bReadonly$ && this.showAsFormattedText$) {
      return "operator";
    }
    if (this.displayAs$ === DROPDOWN_LIST) {
      return "dropdown";
    }
    if (this.displayAs$ === SEARCH_BOX) {
      return "searchbox";
    }
  }

  // Callback passed when subscribing to store change
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
    let props = this.pConn$.getConfigProps();
    this.testId = props["testId"];

    const { label, displayAs, value, showAsFormattedText } = props;

    this.label$ = label;
    this.showAsFormattedText$ = showAsFormattedText;
    this.displayAs$ = displayAs;

    let { readOnly, required, disabled } = props;
    [this.bReadonly$, this.bRequired$, disabled] = [
      readOnly,
      required,
      disabled,
    ].map(
      (prop) => prop === true || (typeof prop === "string" && prop === "true")
    );

    const isUserNameAvailable = (user) => {
      return typeof user === "object" && user !== null && user.userName;
    };

    this.userID$ = this.utils.getUserId(value);

    if (this.userID$ && this.bReadonly$ && this.showAsFormattedText$) {
      if (isUserNameAvailable(value)) {
        this.userName$ = value.userName;
      } else {
        // if same user ref field is referred in view as editable & readonly formatted text
        // referenced users won't be available, so get user details from dx api
        const { getOperatorDetails } = this.PCore$.getUserApi();
        getOperatorDetails(this.userID$).then((resp) => {
          if (
            resp.data &&
            resp.data.pyOperatorInfo &&
            resp.data.pyOperatorInfo.pyUserName
          ) {
            this.userName$ = resp.data.pyOperatorInfo.pyUserName;
          }
        });
      }
    } else if (displayAs === DROPDOWN_LIST || displayAs === SEARCH_BOX) {
      const queryPayload = {
        dataViewName: OPERATORS_DP,
      };
      this.PCore$.getRestClient()
        .invokeRestApi("getListData", { queryPayload })
        .then((resp) => {
          const ddDataSource = resp.data.data.map((listItem) => ({
            key: listItem.pyUserIdentifier,
            value: listItem.pyUserName,
          }));
          this.options$ = ddDataSource;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  fieldOnChange(event: any) {
    if (event?.value === "Select") {
      event.value = "";
    }
    this.angularPConnectData.actions.onChange(this, event);
  }

  fieldOnBlur(event: any) {
    let key = "";
    if (event?.target?.value) {
      const index = this.options$?.findIndex(
        (element) => element.value === event.target.value
      );
      key = index > -1 ? (key = this.options$[index].key) : event.target.value;
    }

    const eve = {
      value: key,
    };
    // PConnect wants to use eventHandler for onBlur
    this.angularPConnectData.actions.onChange(this, eve);
  }

  getErrorMessage() {
    let errMessage: string = "";

    // look for validation messages for json, pre-defined or just an error pushed from workitem (400)
    if (this.fieldControl.hasError("message")) {
      errMessage = this.angularPConnectData.validateMessage;
      return errMessage;
    } else if (this.fieldControl.hasError("required")) {
      errMessage = "You must enter a value";
    } else if (this.fieldControl.errors) {
      errMessage = this.fieldControl.errors.toString();
    }

    return errMessage;
  }
}
