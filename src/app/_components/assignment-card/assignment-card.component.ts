import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProgressSpinnerService } from "../../_messages/progress-spinner.service";
import { ErrorMessagesService } from "../../_messages/error-messages.service";
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Utils } from '../../_helpers/utils';

@Component({
  selector: 'app-assignment-card',
  templateUrl: './assignment-card.component.html',
  styleUrls: ['./assignment-card.component.scss']
})
export class AssignmentCardComponent implements OnInit {

  @Input() pConn$: any;
  @Input() formGroup$: FormGroup;
  @Input() arMainButtons$: Array<any>;
  @Input() arSecondaryButtons$: Array<any>;
  @Input() arChildren$: Array<any>;

  @Output() ActionButtonClick: EventEmitter<any> = new EventEmitter();


  constructor(private utils: Utils) { }

  ngOnInit(): void {

    // Replace any child "reference" components with their
    //  de-referenced View
    const theDereferencedChildren = this.dereferenceChildren();

    // Update to use the de-referenced children...
    this.arChildren$ = theDereferencedChildren;

  }

  ngOnChanges(data: any) {

    // this gets called whenever the Assignment changes and
    //  the change can include getting updated arChildren$. So, we need
    //  to de-reference any children here, too.

    // Replace any child "reference" components with their
    //  de-referenced View
    const theDereferencedChildren = this.dereferenceChildren();

    // Update to use the de-referenced children...
    this.arChildren$ = theDereferencedChildren;

  }

  // Look at the current value of this.arChildren$ and replace any
  //  children that are "reference" components with their
  //  de-referenced View.
  dereferenceChildren() {
    const theDereferencedChildren = (this.pConn$.getChildren())
      ? this.pConn$.getChildren().map((child) => {
        const theChildType = child.getPConnect().getComponentName();
        if (theChildType === 'reference') {
          debugger;
          return child.getPConnect().getReferencedViewPConnect();
        } else {
          return child;
        }
      })
      : null;

    return theDereferencedChildren;
  }

  onActionButtonClick(oData: any) {
    this.ActionButtonClick.emit(oData);
  }



}
