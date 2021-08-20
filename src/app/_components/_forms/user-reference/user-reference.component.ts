import { Component, OnInit, Input } from '@angular/core';
import { Utils } from "../../../_helpers/utils";
import { AngularPConnectService } from "../../../_bridge/angular-pconnect";
// import * as moment from "moment";

@Component({
  selector: 'app-user-reference',
  templateUrl: './user-reference.component.html',
  styleUrls: ['./user-reference.component.scss']
})
export class UserReferenceComponent implements OnInit {

  @Input() pConn$: any;

  userName$: string;
  label$: string;
  date$: string;
  userID$ : string;

  angularPConnectData: any = { };

  PCore$: any;

  constructor(private angularPConnect: AngularPConnectService, private utils: Utils) { }

  ngOnInit(): void {

    if (!this.PCore$) {
      this.PCore$ = window.PCore;
    }

    // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);

    this.updateSelf();
  }

  ngOnDestroy() {

  }

  // Callback passed when subscribing to store change
  onStateChange() {
    // Should always check the bridge to see if the component should
    // update itself (re-render)
    const bUpdateSelf = this.angularPConnect.shouldComponentUpdate( this );
  
    // ONLY call updateSelf when the component should update
    if (bUpdateSelf) {
      this.updateSelf();
    }
  }

  updateSelf() {

    let props = this.pConn$.getConfigProps();

    const {
      label,
      displayAs,
      getPConnect,
      value,
      testId,
      helperText,
      validatemessage,
      placeholder,
      showAsFormattedText,
      dateTimeValue,
      additionalProps
    } = props;

    const OPERATORS_DP = "D_pyGetOperatorsForCurrentApplication";
    const DROPDOWN_LIST = "Drop-down list";
    const SEARCH_BOX = "Search box";

 

    let { readOnly, required, disabled } = props;
    [readOnly, required, disabled] = [readOnly, required, disabled].map(
      (prop) => prop === true || (typeof prop === "string" && prop === "true")
    );

    const getUserId = (user) => {
      let userId = "";
      if (typeof user === "object" && user !== null && user.userId) {
        userId = user.userId;
      } else if (typeof user === "string" && user) {
        userId = user;
      }
      return userId;
    };
  
    const isUserNameAvailable = (user) => {
      return typeof user === "object" && user !== null && user.userName;
    };


    const userId = getUserId(value);
    this.userID$ = userId;

    if (userId && readOnly && showAsFormattedText) {
      this.label$ = label;
      // this.date$ = moment(dateTimeValue.replace("GMT", "+0000"), "YYYYMMDD[T]HHmmss[.]SSS Z").fromNow();
      this.utils.generateDateTime(dateTimeValue, "DateTime-Since");


      
      if (isUserNameAvailable(value)) {
        //setUserName(value.userName);
        this.userName$ = value.userName;
      } else {
        // if same user ref field is referred in view as editable & readonly formatted text
        // referenced users won't be available, so get user details from dx api
        const { getOperatorDetails } = this.PCore$.getUserApi();
        getOperatorDetails(userId).then((resp) => {
          if (
            resp.data &&
            resp.data.pyOperatorInfo &&
            resp.data.pyOperatorInfo.pyUserName
          ) {
            //setUserName(res.data.pyOperatorInfo.pyUserName);
            this.userName$ = resp.data.pyOperatorInfo.pyUserName;
          }
        });
      }
    } else if (displayAs === DROPDOWN_LIST) {
      const queryPayload = {
        dataViewName: OPERATORS_DP
      };
      // PCore.getRestClient()
      //   .invokeRestApi("getListData", { queryPayload })
      //   .then((resp) => {
      //     const ddDataSource = resp.data.data.map((listItem) => ({
      //       key: listItem.pyUserIdentifier,
      //       value: listItem.pyUserName
      //     }));
      //     setDropDownDataSource(ddDataSource);
      //     setLoading(false);
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    }



  }

}
