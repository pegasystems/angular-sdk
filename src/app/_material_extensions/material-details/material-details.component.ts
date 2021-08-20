import { Component, OnInit, Input } from '@angular/core';
import { Utils } from "../../_helpers/utils";

@Component({
  selector: 'app-material-details',
  templateUrl: './material-details.component.html',
  styleUrls: ['./material-details.component.scss']
})
export class MaterialDetailsComponent implements OnInit {

  constructor(private utils: Utils) { }

  @Input() arFields$: Array<any>;
  @Input() arFields2$: Array<any>;
  @Input() arFields3$: Array<any>;

  settingsSvgIcon


  ngOnInit(): void {


  }

  _getValue(configValue) {
    if (configValue && configValue != "") {
      return configValue;
    }
    else {
      return "---";
    }
  }

  _formatDate(dateValue: string, dateFormat: string) : string {
    return this.utils.generateDate(dateValue, dateFormat);

  }

}
