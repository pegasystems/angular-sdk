import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Form } from '@angular/forms';

@Component({
  selector: 'app-wide-narrow-form',
  templateUrl: './wide-narrow-form.component.html',
  styleUrls: ['./wide-narrow-form.component.scss']
})
export class WideNarrowFormComponent implements OnInit {

  @Input() pConn$: any;
  @Input() formGroup$: FormGroup;


  configProps$ : Object;
  arChildren$: Array<any>;


  constructor() { }

  ngOnInit() {
    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());
    this.arChildren$ = this.pConn$.getChildren();
    

  }

}
