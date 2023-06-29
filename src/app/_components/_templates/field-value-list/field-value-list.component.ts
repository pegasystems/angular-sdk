import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AngularPConnectService } from '../../../_bridge/angular-pconnect';
import { FieldGroupUtils } from '../../../_helpers/field-group-utils';
import { Utils } from '../../../_helpers/utils';

@Component({
  selector: 'app-field-value-list',
  templateUrl: './field-value-list.component.html',
  styleUrls: ['./field-value-list.component.scss'],
})
export class FieldValueListTemplate implements OnInit {

  @Input() label$: any;
  @Input() value$: any;
  @Input() displayMode$: any;
  PCore$: any;

  angularPConnectData: any = {};
  configProps$: any;
  pConn$: any;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges() {}

  updateSelf() {}
}
