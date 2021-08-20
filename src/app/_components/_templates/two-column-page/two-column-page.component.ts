import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Form } from '@angular/forms';
import { AngularPConnectService } from "../../../_bridge/angular-pconnect";
import { ProgressSpinnerService } from "../../../_messages/progress-spinner.service";

@Component({
  selector: 'app-two-column-page',
  templateUrl: './two-column-page.component.html',
  styleUrls: ['./two-column-page.component.scss']
})
export class TwoColumnPageComponent implements OnInit {

  @Input() pConn$: any;
  @Input() formGroup$: FormGroup;


  // Used with AngularPConnect
  angularPConnectData: any = {};

  constructor(private psService: ProgressSpinnerService,
              private angularPConnect: AngularPConnectService) { }

  ngOnInit(): void {
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);

    // turn off spinner
    //this.psService.sendMessage(false);
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

    }



  }
}
