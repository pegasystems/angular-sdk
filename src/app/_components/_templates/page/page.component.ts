import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ThrowStmt } from '@angular/compiler';
import { ProgressSpinnerService } from "../../../_messages/progress-spinner.service";
import { AngularPConnectService } from "../../../_bridge/angular-pconnect";

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {

  @Input() pConn$: any;
  @Input() formGroup$: FormGroup;


  configProps$ : Object;
  arChildren$: Array<any>;
  templateName$: string;

  title$: string;

  // Used with AngularPConnect
  angularPConnectData: any = {};

  constructor(private psService: ProgressSpinnerService,
              private angularPConnect: AngularPConnectService) { }

  ngOnInit() {

    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);

    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());
    this.arChildren$ = this.pConn$.getChildren();
    
    this.title$ = this.configProps$["title"];
    let operator = this.configProps$["operator"];

    if (operator && operator != "") {
      this.title$ += ", " + operator;
    }


    // when showing a page, similar to updating root, need to cause viewContainer to call "initContainer"
    sessionStorage.setItem("hasViewContainer", "false");


  }

  ngOnDestroy(): void {
    if (this.angularPConnectData.unsubscribeFn) {
      this.angularPConnectData.unsubscribeFn();
    }
  }


  onStateChange() {

    // Should always check the bridge to see if the component should update itself (re-render)
    const bUpdateSelf = this.angularPConnect.shouldComponentUpdate( this );

    // ONLY call updateSelf when the component should update
    //    AND removing the "gate" that was put there since shouldComponentUpdate
    //      should be the real "gate"
    if (bUpdateSelf) {
      // turn off spinner
      //this.psService.sendMessage(false);
    }



  }

}
