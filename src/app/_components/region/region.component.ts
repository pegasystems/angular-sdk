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

    // iterate over the children and replace any "reference" components with the
    //  View they reference

    const theDereferencedChildren = (this.pConn$.getChildren())
      ? this.pConn$.getChildren().map((child) => {
        const theChildType = child.getPConnect().getComponentName();
        if (theChildType === 'reference') {
          return child.getPConnect().getReferencedViewPConnect();
        } else {
          return child;
        }
      })
      : null;

      this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());
      // Use the de-referenced children...
      this.arChildren$ = theDereferencedChildren;

  }

}
