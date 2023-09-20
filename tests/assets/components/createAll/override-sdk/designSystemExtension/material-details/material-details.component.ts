import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Utils } from '@pega/angular-sdk-library';
import { ComponentMapperComponent } from '@pega/angular-sdk-library';

@Component({
  selector: 'app-material-details',
  templateUrl: './material-details.component.html',
  styleUrls: ['./material-details.component.scss'],
  standalone: true,
  imports: [CommonModule, forwardRef(() => ComponentMapperComponent)]
})
export class MaterialDetailsComponent implements OnInit {
  constructor(private utils: Utils) {}

  @Input() arFields$: Array<any>;
  @Input() arFields2$: Array<any>;
  @Input() arFields3$: Array<any>;
  @Input() arHighlightedFields: Array<any>;
  @Input() layout: any;

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
