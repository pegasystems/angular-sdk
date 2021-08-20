import { Component, OnInit, Input } from '@angular/core';
import { Utils } from "../../_helpers/utils";


@Component({
  selector: 'app-material-case-summary',
  templateUrl: './material-case-summary.component.html',
  styleUrls: ['./material-case-summary.component.scss']
})
export class MaterialCaseSummaryComponent implements OnInit {

  @Input() status$: string;
  @Input() bShowStatus$: boolean;
  @Input() primaryFields$: Array<any>;
  @Input() secondaryFields$: Array<any>;

  primaryFieldsWithStatus$: Array<any>;

  constructor(private utils: Utils) { }

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
      switch(field.type.toLowerCase()) {
        case "caseoperator":
          if (field.config.label.toLowerCase() == "create operator") {
            field.config["displayLabel"] = field.config.createLabel;
          }
          else if (field.config.label.toLowerCase() == "update operator") {
            field.config["displayLabel"] = field.config.updateLabel;
          }
          break;
        case "date":
          field.config.value = this.utils.generateDate(field.config.value, "Date-Long");
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
      const oStatus = { type: "status", config: { value: this.status$, label: "Status" }};

      const count = this.primaryFieldsWithStatus$.length;
      if (count < 2) {
        this.primaryFieldsWithStatus$.push(oStatus);
      }
      else {
        this.primaryFieldsWithStatus$.splice(1, 0, oStatus);
      }
    }
  }





}
