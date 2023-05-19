import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-action-buttons',
  templateUrl: './action-buttons.component.html',
  styleUrls: ['./action-buttons.component.scss'],
})
export class ActionButtonsComponent implements OnInit {
  @Input() arMainButtons$: Array<any>;
  @Input() arSecondaryButtons$: Array<any>;

  @Output() ActionButtonClick: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  buttonClick(sAction, sButtonType) {
    this.ActionButtonClick.emit({ action: sAction, buttonType: sButtonType });
  }
}
