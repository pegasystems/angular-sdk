import { Component, OnInit, Input, Renderer2 } from '@angular/core';
import { Utils } from "../../_helpers/utils";
import { NgZone } from '@angular/core';
import { ChangeDetectorRef } from "@angular/core";

@Component({
  selector: 'app-operator',
  templateUrl: './operator.component.html',
  styleUrls: ['./operator.component.scss']
})
export class OperatorComponent implements OnInit {


  @Input() date$: string;
  @Input() name$: string;

  @Input() label$: string;
  @Input() helperText$ : string;
  @Input() id$: string;

  fields$: Array<any> = [];
  bShowPopover$: boolean;

  PCore$: any;

  constructor(private renderer: Renderer2,
              private cdRef: ChangeDetectorRef,
              private ngZone: NgZone,
              private utils: Utils) { 


  }

  ngOnInit(): void {

    if (!this.PCore$) {
      this.PCore$ = window.PCore;
    }

    this.renderer.listen('window', 'click',(e:Event)=>{ 
      if (this.bShowPopover$) {
        this.bShowPopover$ = false;
      }  
    })

    this.date$ = this.utils.generateDate(this.date$, "DateTime-Since");
    this.bShowPopover$ = false;


  }

  ngOnDestroy(): void {
    this.renderer.destroy();
    
  }




  showOperator() {

      const operatorPreviewPromise = this.PCore$.getUserApi().getOperatorDetails(this.id$);

      operatorPreviewPromise.then((res) => {
        if (
          res.data &&
          res.data.pyOperatorInfo &&
          res.data.pyOperatorInfo.pyUserName
        ) {

            
            this.fields$ = [
              {
                id: "pyPosition",
                name: "Position",
                value: res.data.pyOperatorInfo.pyPosition != "" ? res.data.pyOperatorInfo.pyPosition : "---"
              },
              {
                id: "pyOrganization",
                name: "Organization",
                value: res.data.pyOperatorInfo.pyOrganization != "" ? res.data.pyOperatorInfo.pyOrganization : "---"
              },
              {
                id: "ReportToUserName",
                name: "Reports to",
                value: res.data.pyOperatorInfo.pyReportToUserName != "" ? res.data.pyOperatorInfo.pyReportToUserName : "---"
              },
              {
                id: "pyTelephone",
                name: "Telephone",
                value: res.data.pyOperatorInfo.pyTelephone != "" ? res.data.pyOperatorInfo.pyTelephone : "---"
              },
              {
                id: "pyEmailAddress",
                name: "Email address",
                value: res.data.pyOperatorInfo.pyEmailAddress != "" ? res.data.pyOperatorInfo.pyEmailAddress : "---"
              }
            ];


            this.bShowPopover$ = true;
            this.cdRef.detectChanges();

        }

      });


  }

}
