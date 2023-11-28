import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Utils } from '@pega/angular-sdk-library';
import { ComponentMapperComponent } from '@pega/angular-sdk-library';

@Component({
  selector: 'app-pega-dxil-my-page-case-widget',
  templateUrl: './pega-dxil-my-page-case-widget.component.html',
  styleUrls: ['./pega-dxil-my-page-case-widget.component.scss'],
  standalone: true,
  imports: [CommonModule, forwardRef(() => ComponentMapperComponent)]
})
export class PegaDxilMyPageCaseWidgetComponent implements OnInit {
  @Input() status$: string;
  @Input() bShowStatus$: boolean;
  @Input() primaryFields$: Array<any>;
  @Input() secondaryFields$: Array<any>;

  primaryFieldsWithStatus$: Array<any>;

  constructor(private utils: Utils) {}

  ngOnInit(): void {
    this.updatePrimaryWithStatus();
    this.updateLabelAndDate(this.primaryFieldsWithStatus$);
    this.updateLabelAndDate(this.secondaryFields$);
  }

  ngOnChanges() {
    this.updatePrimaryWithStatus();
    this.updateLabelAndDate(this.primaryFieldsWithStatus$);
    this.updateLabelAndDate(this.secondaryFields$);
  }

  updateLabelAndDate(arData: Array<any>) {
    for (let field of arData) {
      switch (field.type.toLowerCase()) {
        case 'caseoperator':
          if (field.config.label.toLowerCase() == 'create operator') {
            field.config['displayLabel'] = field.config.createLabel;
          } else if (field.config.label.toLowerCase() == 'update operator') {
            field.config['displayLabel'] = field.config.updateLabel;
          }
          break;
        case 'date':
          field.config.value = this.utils.generateDate(field.config.value, 'Date-Long');
          break;
        case 'userreference':
        case 'decimal':
        case 'dropdown':
          field.config['displayLabel'] = field.config.label;
          break;
        case 'checkbox':
          field.config['displayLabel'] = field.config.caption;
          break;
      }
    }
  }

  updatePrimaryWithStatus() {
    this.primaryFieldsWithStatus$ = [];
    for (let prim of this.primaryFields$) {
      this.primaryFieldsWithStatus$.push(prim);
    }

    if (this.bShowStatus$) {
      const oStatus = { type: 'status', config: { value: this.status$, label: 'Status' } };

      const count = this.primaryFieldsWithStatus$.length;
      if (count < 2) {
        this.primaryFieldsWithStatus$.push(oStatus);
      } else {
        this.primaryFieldsWithStatus$.splice(1, 0, oStatus);
      }
    }
  }
}
