import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.scss']
})

export class RegionComponent implements OnInit {

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
