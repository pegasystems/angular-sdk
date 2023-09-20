import { Component, OnInit, Input } from '@angular/core';
import { AngularPConnectService } from '@pega/angular-sdk-library';
import { FormGroup } from '@angular/forms';
import { MaterialDetailsComponent } from '@pega/angular-sdk-library';

@Component({
  selector: 'app-details-one-column',
  templateUrl: './details-one-column.component.html',
  styleUrls: ['./details-one-column.component.scss'],
  standalone: true,
  imports: [MaterialDetailsComponent]
})
export class DetailsOneColumnComponent implements OnInit {
  constructor(private angularPConnect: AngularPConnectService) {}

  @Input() pConn$: any;
  @Input() formGroup$: FormGroup;
  showHighlightedData: boolean;
  highlightedDataArr: any;

  arFields$: Array<any> = [];

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

    this.pConn$.setInheritedProp('displayMode', 'LABELS_LEFT');
    this.pConn$.setInheritedProp('readOnly', true);

    let kids = this.pConn$.getChildren();
    for (let kid of kids) {
      let pKid = kid.getPConnect();
      let pKidData = pKid.resolveConfigProps(pKid.getRawMetadata());
      if (kids.indexOf(kid) == 0) {
        this.arFields$ = pKidData.children;
      }
    }
  }
}
