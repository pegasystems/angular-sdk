import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Form } from '@angular/forms';
import { AngularPConnectService } from "../../../_bridge/angular-pconnect";
import { ProgressSpinnerService } from "../../../_messages/progress-spinner.service";
import { ReferenceComponent } from '../../reference/reference.component';

@Component({
  selector: 'app-wide-narrow-page',
  templateUrl: './wide-narrow-page.component.html',
  styleUrls: ['./wide-narrow-page.component.scss']
})
export class WideNarrowPageComponent implements OnInit {

  @Input() pConn$: any;
  @Input() formGroup$: FormGroup;

  thePConnType: string = "";


  // Used with AngularPConnect
  angularPConnectData: any = {};

  constructor(private psService: ProgressSpinnerService,
              private angularPConnect: AngularPConnectService) { }

  ngOnInit(): void {

    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);

    // turn off spinner
    //this.psService.sendMessage(false);

    this.updateSelf();
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
      this.updateSelf()

    }

  }

  updateSelf() {
    console.log(`WideNarrowPage: updateSelf`);

    this.thePConnType = this.pConn$.getComponentName();
    
  }
}
