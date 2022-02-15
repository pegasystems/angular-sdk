import { Component, OnInit, Input } from '@angular/core';
import { AngularPConnectService } from "../../_bridge/angular-pconnect";


//
// WARNING:  It is not expected that this file should be modified.  It is part of infrastructure code that works with
// Redux and creation/update of Redux containers and PConnect.  Modifying this code could have undesireable results and
// is totally at your own risk.
//

@Component({
  selector: 'reference-component',
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.scss']
})

export class ReferenceComponent implements OnInit {

  @Input() pConn$: any;
  @Input() displayOnlyFA$ : boolean;

  angularPConnectData: any = { };
  configProps$ : Object;
  componentName$: string = "";
  referencedComponent: any = null;


  constructor(private angularPConnect: AngularPConnectService) {
  }

  ngOnInit(): void {
    // debugger;

    // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);

    // Then, continue on with other initialization
    // Do initial update...
    this.updateSelf();

  }

  // Callback passed when subscribing to store change
  onStateChange() {
    // Should always check the bridge to see if the component should
    // update itself (re-render)
    const bUpdateSelf = this.angularPConnect.shouldComponentUpdate( this );

    // debugger;

    // ONLY call updateSelf when the component should update
    if (bUpdateSelf) {
      this.updateSelf();
    }
  }

  updateSelf() {
    // debugger;

    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());

    const referenceConfig = { ...this.pConn$.getComponentConfig() } || {};

    // debugger;

    delete referenceConfig?.name;
    delete referenceConfig?.type;
    delete referenceConfig?.visibility;

    const viewMetadata = this.pConn$.getReferencedView();

    if (!viewMetadata) {
      console.log("View not found ", this.pConn$.getComponentConfig());
      // debugger;
      return null;
    }

    // If we get here, we have metadata for a View component...
    this.componentName$ = viewMetadata.type;

    const viewObject = {
      ...viewMetadata,
      config: {
        ...viewMetadata.config,
        ...referenceConfig
      }
    };

    // eslint-disable-next-line no-console
    console.log( `Reference: about to call createComponent with pageReference: context: ${this.configProps$["context"]}`);

    const viewComponent = this.pConn$.createComponent(viewObject, null, null, {
      pageReference: this.configProps$["context"]
    });

    // debugger;

    // updating the referencedComponent should trigger a render
    const newCompPConnect = viewComponent.getPConnect();

    newCompPConnect.setInheritedConfig({
          ...referenceConfig,
          readOnly: this.configProps$["readOnly"] ? this.configProps$["readOnly"] : false,
          displayMode: this.configProps$["displayMode"] ? this.configProps$["displayMode"]: null
        }
    );

    console.log(`Angular Reference component: newCompPConnect configProps: ${JSON.stringify(newCompPConnect.getConfigProps())}`);

    this.referencedComponent = newCompPConnect;

    // From React implementation...
    // viewComponent.props.getPConnect().setInheritedConfig({
    //   ...referenceConfig,
    //   readOnly: this.configProps$["readOnly"] ? this.configProps$["readOnly"] : false,
    //   displayMode: this.configProps$["displayMode"] ? this.configProps$["displayMode"]: null
    // });

  }

}
