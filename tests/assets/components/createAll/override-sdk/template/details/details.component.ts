import { Component, OnInit, Input } from '@angular/core';
import { AngularPConnectService } from '@pega/angular-sdk-library';
import { MaterialDetailsComponent } from '@pega/angular-sdk-library';

declare const window: any;

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  standalone: true,
  imports: [MaterialDetailsComponent]
})
export class DetailsComponent implements OnInit {
  constructor(private angularPConnect: AngularPConnectService) {}

  @Input() pConn$: any;

  PCore$: any;

  highlightedDataArr: Array<any> = [];
  showHighlightedData: boolean;
  arFields$: Array<any> = [];

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
      this.arFields$ = [];
      let pKid = kid.getPConnect();
      const fields = pKid.getChildren();
      fields?.forEach((field) => {
        const thePConn = field.getPConnect();
        const theCompType = thePConn.getComponentName().toLowerCase();
        if (theCompType === 'reference') {
          const configProps = thePConn.getConfigProps();
          configProps.readOnly = true;
          configProps.displayMode = 'LABELS_LEFT';
          const propToUse = { ...thePConn.getInheritedProps() };
          configProps.label = propToUse?.label;
          const options = {
            context: thePConn.getContextName(),
            pageReference: thePConn.getPageReference(),
            referenceList: thePConn.getReferenceList()
          };
          const viewContConfig = {
            meta: {
              type: theCompType,
              config: configProps
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
          };
          this.arFields$.push(data);
        }
      });
    }
  }
}
