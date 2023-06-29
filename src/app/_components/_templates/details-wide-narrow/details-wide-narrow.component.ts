import { Component, OnInit, Input } from '@angular/core';
import { AngularPConnectService } from '../../../_bridge/angular-pconnect';

@Component({
  selector: 'app-details-wide-narrow',
  templateUrl: './details-wide-narrow.component.html',
  styleUrls: ['./details-wide-narrow.component.scss'],
})
export class DetailsWideNarrowComponent implements OnInit {
  constructor(private angularPConnect: AngularPConnectService) {}

  @Input() pConn$: any;

  arFields$: Array<any> = [];
  arFields2$: Array<any> = [];
  highlightedDataArr: Array<any> = [];
  showHighlightedData: boolean;
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
    const rawMetaData = this.pConn$.resolveConfigProps(this.pConn$.getRawMetadata().config);  
    this.showHighlightedData = rawMetaData?.showHighlightedData;

    if( this.showHighlightedData ){
      const highlightedData = rawMetaData?.highlightedData;
      this.highlightedDataArr = highlightedData.map(field => {
        field.config.displayMode = 'STACKED_LARGE_VAL';

        if (field.config.value === '@P .pyStatusWork') {
          field.type = 'TextInput';
          field.config.displayAsStatus = true;
        }

        return field;
      });
    }
    let kids = this.pConn$.getChildren();
    for (let kid of kids) {
      let pKid = kid.getPConnect();
      let pKidData = pKid.resolveConfigProps(pKid.getRawMetadata());
      if (kids.indexOf(kid) == 0) {
        this.arFields$ = pKidData.children;
      } else {
        this.arFields2$ = pKidData.children;
      }
    }
  }
}
