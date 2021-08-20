import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProgressSpinnerService } from "../../_messages/progress-spinner.service";
import { ErrorMessagesService } from "../../_messages/error-messages.service";
import { FormControl, Validators, FormGroup } from '@angular/forms';



@Component({
  selector: 'app-action-buttons',
  templateUrl: './action-buttons.component.html',
  styleUrls: ['./action-buttons.component.scss']
})
export class ActionButtonsComponent implements OnInit {


  @Input() arMainButtons$: Array<any>;
  @Input() arSecondaryButtons$: Array<any>;


  @Output() ActionButtonClick: EventEmitter<any> = new EventEmitter();



  constructor(private psService: ProgressSpinnerService,
              private erService: ErrorMessagesService) { }

  ngOnInit(): void {



  }



  buttonClick(sAction, sButtonType) {
    
    this.ActionButtonClick.emit({ "action": sAction, "buttonType": sButtonType});
  
  }



}
