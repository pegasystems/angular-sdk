import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { AngularPConnectService } from '@pega/angular-sdk-library';
import { RegionComponent } from '@pega/angular-sdk-library';
import { ViewComponent } from '@pega/angular-sdk-library';

@Component({
  selector: 'app-pega-dxil-my-page',
  templateUrl: './pega-dxil-my-page.component.html',
  styleUrls: ['./pega-dxil-my-page.component.scss'],
  standalone: true,
  imports: [CommonModule, RegionComponent, forwardRef(() => ViewComponent)]
})
export class PegaDxilMyPageComponent implements OnInit {
  @Input() pConn$: any;
  @Input() formGroup$: FormGroup;

  // Used with AngularPConnect
  angularPConnectData: any = {};

  configProps$: Object;
  arChildren$: Array<any>;
  title$: string;

  constructor(private angularPConnect: AngularPConnectService) {}

  ngOnInit() {
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);

    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());
    this.arChildren$ = this.pConn$.getChildren();

    this.title$ = this.configProps$['title'];
    let operator = this.configProps$['operator'];

    if (operator && operator != '') {
      this.title$ += ', ' + operator;
    }

    // when showing a page, similar to updating root, need to cause viewContainer to call "initContainer"
    sessionStorage.setItem('hasViewContainer', 'false');
  }

  ngOnDestroy(): void {
    if (this.angularPConnectData.unsubscribeFn) {
      this.angularPConnectData.unsubscribeFn();
    }
  }

  onStateChange() {
    // Should always check the bridge to see if the component should update itself (re-render)
    const bUpdateSelf = this.angularPConnect.shouldComponentUpdate(this);

    // ONLY call updateSelf when the component should update
    //    AND removing the "gate" that was put there since shouldComponentUpdate
    //      should be the real "gate"
    if (bUpdateSelf) {
      // turn off spinner
      //this.psService.sendMessage(false);
    }
  }
}
