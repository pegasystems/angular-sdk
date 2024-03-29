import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AngularPConnectService } from '@pega/angular-sdk-library';
import { ReferenceComponent } from '@pega/angular-sdk-library';
import { ComponentMapperComponent } from '@pega/angular-sdk-library';

@Component({
  selector: 'app-case-summary',
  templateUrl: './case-summary.component.html',
  styleUrls: ['./case-summary.component.scss'],
  standalone: true,
  imports: [forwardRef(() => ComponentMapperComponent)]
})
export class CaseSummaryComponent implements OnInit {
  @Input() pConn$: any;
  @Input() formGroup$: FormGroup;

  angularPConnectData: any = {};

  configProps$: Object;
  arChildren$: Array<any>;

  status$: string;
  bShowStatus$: boolean;
  primaryFields$: Array<any> = [];
  secondaryFields$: Array<any> = [];

  constructor(private angularPConnect: AngularPConnectService) {}

  ngOnInit(): void {
    // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);

    this.initComponent();
  }

  ngOnDestroy(): void {
    if (this.angularPConnectData.unsubscribeFn) {
      this.angularPConnectData.unsubscribeFn();
    }
  }

  initComponent() {
    // dereference the View in case the incoming pConn$ is a 'reference'
    this.pConn$ = ReferenceComponent.normalizePConn(this.pConn$);

    // Then, continue on with other initialization

    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());
    this.arChildren$ = this.pConn$.getChildren();

    this.generatePrimaryAndSecondaryFields();

    this.status$ = this.configProps$['status'];
    this.bShowStatus$ = this.configProps$['showStatus'];
  }

  // Callback passed when subscribing to store change
  onStateChange() {
    // Should always check the bridge to see if the component should
    // update itself (re-render)
    const bUpdateSelf = this.angularPConnect.shouldComponentUpdate(this);

    // ONLY call updateSelf when the component should update
    if (bUpdateSelf) {
      this.updateSelf();
    }
  }

  updateSelf() {
    this.generatePrimaryAndSecondaryFields();
  }

  ngOnChanges() {
    this.initComponent();
  }

  generatePrimaryAndSecondaryFields() {
    this.primaryFields$ = [];
    this.secondaryFields$ = [];

    for (let oField of this.arChildren$[0].getPConnect().getChildren()) {
      let kid = oField.getPConnect();
      this.primaryFields$.push(kid.resolveConfigProps(kid.getRawMetadata()));
    }

    for (let oField of this.arChildren$[1].getPConnect().getChildren()) {
      let kid = oField.getPConnect();
      this.secondaryFields$.push(kid.resolveConfigProps(kid.getRawMetadata()));
    }
  }
}
