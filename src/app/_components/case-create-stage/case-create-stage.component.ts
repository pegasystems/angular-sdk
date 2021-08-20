import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AngularPConnectService } from "../../_bridge/angular-pconnect";

@Component({
  selector: 'app-case-create-stage',
  templateUrl: './case-create-stage.component.html',
  styleUrls: ['./case-create-stage.component.scss']
})
export class CaseCreateStageComponent implements OnInit {

  @Input() pConn$: any;
  @Input() formGroup$: FormGroup;
  arChildren$: Array<any>;

  // For interaction with AngularPConnect
  angularPConnectData: any = {};

  constructor(private angularPConnect: AngularPConnectService) { 

    
  }

  ngOnInit(): void {

    // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);

    this.updateSelf();
  }

  ngOnDestroy() {

    //this.storeUnsubscribe();
    if (this.angularPConnectData.unsubscribeFn) {
      this.angularPConnectData.unsubscribeFn();
    }

  }


  // Callback passed when subscribing to store change
  onStateChange() {
    // Should always check the bridge to see if the component should update itself (re-render)
    const bUpdateSelf = this.angularPConnect.shouldComponentUpdate( this );

    // ONLY call updateSelf when the component should update
    //    AND removing the "gate" that was put there since shouldComponentUpdate
    //      should be the real "gate"
    if (bUpdateSelf) {
      this.updateSelf();
    }



  }

  updateSelf() {

    this.arChildren$ = this.pConn$.getChildren();
    
  }



}
