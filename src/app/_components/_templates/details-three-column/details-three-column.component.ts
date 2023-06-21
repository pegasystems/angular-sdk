import { Component, OnInit, Input } from '@angular/core';
import { AngularPConnectService } from '../../../_bridge/angular-pconnect';

@Component({
  selector: 'app-details-three-column',
  templateUrl: './details-three-column.component.html',
  styleUrls: ['./details-three-column.component.scss'],
})
export class DetailsThreeColumnComponent implements OnInit {
  constructor(private angularPConnect: AngularPConnectService) {}

  @Input() pConn$: any;

  arFields$: Array<any> = [];
  arFields2$: Array<any> = [];
  arFields3$: Array<any> = [];
  propsToUse: any = {};
  // Used with AngularPConnect
  angularPConnectData: any = {};

  ngOnInit(): void {
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
    const bUpdateSelf = this.angularPConnect.shouldComponentUpdate(this);

    // ONLY call updateSelf when the component should update
    if (bUpdateSelf) {
      this.updateSelf();
    }
  }

  updateSelf() {
    const theConfigProps = this.pConn$.getConfigProps();
    const label = theConfigProps.label;
    const showLabel = theConfigProps.showLabel;
    this.propsToUse = { label, showLabel, ...this.pConn$.getInheritedProps() };
    let kids = this.pConn$.getChildren();
    for (let kid of kids) {
      let pKid = kid.getPConnect();
      let pKidData = pKid.resolveConfigProps(pKid.getRawMetadata());
      if (kids.indexOf(kid) == 0) {
        this.arFields$ = pKidData.children;
      } else if (kids.indexOf(kid) == 1) {
        this.arFields2$ = pKidData.children;
      } else {
        this.arFields3$ = pKidData.children;
      }
    }
  }
}
