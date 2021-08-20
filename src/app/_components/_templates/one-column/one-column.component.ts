import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-one-column',
  templateUrl: './one-column.component.html',
  styleUrls: ['./one-column.component.scss']
})
export class OneColumnComponent implements OnInit {

  @Input() pConn$: any;
  @Input() formGroup$: FormGroup;


  configProps$ : Object;
  arChildren$: Array<any>;

  constructor() { }

  ngOnInit(): void {
    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());
    this.arChildren$ = this.pConn$.getChildren();
  

  }

}
