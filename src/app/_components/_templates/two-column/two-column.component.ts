import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Form } from '@angular/forms';

@Component({
  selector: 'app-two-column',
  templateUrl: './two-column.component.html',
  styleUrls: ['./two-column.component.scss']
})
export class TwoColumnComponent implements OnInit {

  @Input() pConn$: any;
  @Input() formGroup$: FormGroup;


  configProps$ : Object;
  arChildren$: Array<any>;


  constructor() {
    debugger;
   }

  ngOnInit() {
    debugger;

    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());
    this.arChildren$ = this.pConn$.getChildren();
    

  }

}
