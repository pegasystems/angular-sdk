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

  }

  ngOnChanges(data: any) {

    
  }

  onActionButtonClick(oData: any) {
    this.ActionButtonClick.emit(oData);
  }



}
