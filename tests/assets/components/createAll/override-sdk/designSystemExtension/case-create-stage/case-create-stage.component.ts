import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { AngularPConnectService } from '@pega/angular-sdk-library';
import { ComponentMapperComponent } from '@pega/angular-sdk-library';

@Component({
  selector: 'app-case-create-stage',
  templateUrl: './case-create-stage.component.html',
  styleUrls: ['./case-create-stage.component.scss'],
  standalone: true,
  imports: [CommonModule, forwardRef(() => ComponentMapperComponent)]
})
export class CaseCreateStageComponent implements OnInit {
  @Input() pConn$: any;
  @Input() formGroup$: FormGroup;

  arChildren$: Array<any>;

  // For interaction with AngularPConnect
  angularPConnectData: any = {};

  constructor(private angularPConnect: AngularPConnectService) {}

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

  // Callback passed when subscribing to store change
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
    this.arChildren$ = this.pConn$.getChildren();
  }
}
