import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { getAllFields } from '../_templates/utils';
import { AngularPConnectService } from "../../_bridge/angular-pconnect";
import { throwError } from 'rxjs';
import { Utils } from "../../_helpers/utils";

//
// WARNING:  It is not expected that this file should be modified.  It is part of infrastructure code that works with 
// Redux and creation/update of Redux containers and PConnect.  Modifying this code could have undesireable results and
// is totally at your own risk.
//

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  @Input() pConn$: any;
  @Input() formGroup$: FormGroup;
  @Input() displayOnlyFA$ : boolean;

  angularPConnectData: any = { };

  configProps$ : Object;
  arChildren$: Array<any>;
  templateName$: string;
  title$: string = "";

  constructor(private angularPConnect: AngularPConnectService,
              private utils: Utils ) { }

  ngOnInit() {

    // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);

    // Then, continue on with other initialization

    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());
    this.arChildren$ = this.pConn$.getChildren();
    this.templateName$ = ('template' in this.configProps$) ? this.configProps$["template"] : "";
    this.title$ = ('title' in this.configProps$) ? this.configProps$["title"] : "";

  
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

  ngOnChanges() {
    this.updateSelf();
  }

  updateSelf() {
    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());
    this.arChildren$ = this.pConn$.getChildren();
    this.templateName$ = ('template' in this.configProps$) ? this.configProps$["template"] : "";
    this.title$ = ('title' in this.configProps$) ? this.configProps$["title"] : "";

  }


  // JA - adapting additionalProps from Nebula/Constellation version which uses static methods
  //    on the component classes stored in PComponents (that Angular doesn't have)...
  additionalProps( state: any, getPConnect: any ) {
    let propObj = {};

    // We already have the template name in this.templateName$
    if (this.templateName$ !== "") {

      let allFields = {};

      // These uses are adapted from Nebula/Constellation CaseSummary.additionalProps
      switch( this.templateName$ ) {
        case "CaseSummary":
          allFields = getAllFields(getPConnect);
          const unresFields = {
            primaryFields: allFields[0],
            secondaryFields: allFields[1]
          }
          propObj = getPConnect.resolveConfigProps( unresFields );
          break;

        case "Details":
          allFields = getAllFields(getPConnect);
          propObj = { fields: allFields[0] }
          break;

      }
    }

    return propObj;

  }

  ngOnDestroy(): void {
    if (this.angularPConnectData.unsubscribeFn) {
      this.angularPConnectData.unsubscribeFn();
    }
  }

}
