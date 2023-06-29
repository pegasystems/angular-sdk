import { Component, OnInit, Input } from '@angular/core';
import { Utils } from '../../_helpers/utils';

@Component({
  selector: 'app-material-details-fields',
  templateUrl: './material-details-fields.component.html',
  styleUrls: ['./material-details-fields.component.scss'],
})
export class MaterialDetailsFieldsComponent implements OnInit {
  PCore$: any;
  angularPConnect: any;
  constructor(private utils: Utils) {}

  @Input() arFields$: Array<any>;
  @Input() arHighlightedFields: Array<any>;

  ngOnInit(): void {}


  _getValue(configValue) {
    if (configValue && configValue != '') {
      return configValue;
    } else {
      return '---';
    }
  }

  _formatDate(dateValue: string, dateFormat: string): string {
    return this.utils.generateDate(dateValue, dateFormat);
  }
}
