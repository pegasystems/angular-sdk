import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-default-form',
  templateUrl: './default-form.component.html',
  styleUrls: ['./default-form.component.scss']
})
export class DefaultFormComponent implements OnInit {

  @Input() pConn$: any;
  @Input() formGroup$: FormGroup;



  configProps$ : Object;
  arChildren$: Array<any>;
  divClass$: string;

  constructor() { }

  ngOnInit(): void {
    let configProps = this.pConn$.getConfigProps();
    let kids = this.pConn$.getChildren();

    let numCols = configProps.NumCols ? configProps.NumCols : "1";
    switch (numCols) {
      case "1" :
        this.divClass$ = "psdk-default-form-one-column";
        break;
      case "2" :
        this.divClass$ = "psdk-default-form-two-column";
        break;
      case "3" :
        this.divClass$ = "psdk-default-form-three-column";
        break;
      default :
        this.divClass$ = "psdk-default-form-one-column";
        break;
    }

    // repoint children before getting templateArray
    this.arChildren$ = this.dereferenceChildren(kids[0].getPConnect().getChildren());


  }

  // Look at the current value of this.arChildren$ and replace any
  //  children that are "reference" components with their
  //  de-referenced View.
  dereferenceChildren(inChildren) {
    const theDereferencedChildren = (inChildren)
      ? inChildren.map((child) => {
        const theChildType = child.getPConnect().getComponentName();
        if (theChildType === 'reference') {
          return child.getPConnect().getReferencedViewPConnect();
        } else {
          return child;
        }
      })
      : null;

    return theDereferencedChildren;
  }


}
