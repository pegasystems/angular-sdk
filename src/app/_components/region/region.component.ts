import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ReferenceComponent } from '../reference/reference.component';

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

    // The children may contain 'reference' components, so normalize the children...
    debugger;

    this.arChildren$ = ReferenceComponent.normalizePConnArray(this.pConn$.getChildren());

    debugger;
  }

}
