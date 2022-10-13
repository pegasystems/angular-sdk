import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { getAllFields } from '../_templates/utils';
import { AngularPConnectService } from "../../_bridge/angular-pconnect";
import { throwError } from 'rxjs';
import { Utils } from "../../_helpers/utils";
import { ReferenceComponent } from '../reference/reference.component';

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
  //@Input() updateToken$: number;

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

    // const bUpdateSelf = this.angularPConnect.shouldComponentUpdate( this );

    // // ONLY call updateSelf when the component should update
    // if (bUpdateSelf) {
    //   this.updateSelf();
    // }
    this.checkAndUpdate();

  }

  // Callback passed when subscribing to store change
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

  ngOnChanges(data: any) {


    this.checkAndUpdate();
  
    
  }

  updateSelf() {

    if (this.angularPConnect.getComponentID(this) === undefined) {
      return;
    }

    //debugger;

    // normalize this.pConn$ in case it contains a 'reference'
    this.pConn$ = ReferenceComponent.normalizePConn(this.pConn$);

    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());

    // NOTE: this.configProps$['visibility'] is used in view.component.ts such that
    //  the View will only be rendered when this.configProps$['visibility'] is false.
    //  It WILL render if true or undefined.

    this.templateName$ = ('template' in this.configProps$) ? this.configProps$["template"] : "";
    this.title$ = ('title' in this.configProps$) ? this.configProps$["title"] : "";
    // children may have a 'reference' so normalize the children array
    this.arChildren$ = ReferenceComponent.normalizePConnArray( this.pConn$.getChildren() );
    // was:  this.arChildren$ = this.pConn$.getChildren();

    // debug
    // let  kidList: string = "";
    // for (let i in this.arChildren$) {
    //   kidList = kidList.concat(this.arChildren$[i].getPConnect().getComponentName()).concat(",");
    // }
    //console.log("-->view update: " + this.angularPConnect.getComponentID(this) + ", template: " + this.templateName$ + ", kids: " + kidList);

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
          // eslint-disable-next-line no-case-declarations
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