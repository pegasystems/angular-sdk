import { Component, OnInit, Input } from '@angular/core';
import { AngularPConnectService } from "../../../_bridge/angular-pconnect";

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  constructor(private angularPConnect: AngularPConnectService) { }

  @Input() pConn$: any;

  arFields$: Array<any> = [];
  PCore$: any;

  // Used with AngularPConnect
  angularPConnectData: any = {};

  ngOnInit(): void {
    if (!this.PCore$) {
      this.PCore$ = window.PCore;
    }

    // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);

    //this.updateSelf();
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
  const bUpdateSelf = this.angularPConnect.shouldComponentUpdate( this );

  // ONLY call updateSelf when the component should update
  if (bUpdateSelf) {
    this.updateSelf();
  }
}

 updateSelf() {
 

  let kids = this.pConn$.getChildren();
  for (let kid of kids) {
    this.arFields$ = [];
    let pKid = kid.getPConnect();
    const fields = pKid.getChildren();
    fields?.forEach((field) => {
      const thePConn = field.getPConnect();
      const theCompType = thePConn.getComponentName().toLowerCase();
      if (theCompType === 'reference') {
        const configProps = thePConn.getConfigProps();
        configProps.readOnly = true;
        configProps.displayMode = "LABELS_LEFT";
        const propToUse = { ...thePConn.getInheritedProps()};
        configProps.label = propToUse?.label;
        const options = {
          context: thePConn.getContextName(),
          pageReference: thePConn.getPageReference(),
          referenceList: thePConn.getReferenceList()
        };
        const viewContConfig = {
          "meta": {
            "type": theCompType,
            "config": configProps
          },
        options
        };
        const theViewCont = this.PCore$.createPConnect(viewContConfig);
        const data = {
          type: theCompType,
          pConn: theViewCont?.getPConnect()
        };
        this.arFields$.push(data);
      } else {
        const data = {
          type: theCompType,
          config: thePConn.getConfigProps()
        }
        this.arFields$.push(data);
      }
    });
  }


 }

}
