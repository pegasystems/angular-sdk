import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-action-buttons',
  templateUrl: './action-buttons.component.html',
  styleUrls: ['./action-buttons.component.scss'],
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatButtonModule]
})
export class ActionButtonsComponent implements OnInit {
  @Input() arMainButtons$: Array<any>;
  @Input() arSecondaryButtons$: Array<any>;

  @Output() actionButtonClick: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  buttonClick(sAction, sButtonType) {
    this.actionButtonClick.emit({ action: sAction, buttonType: sButtonType });
  }
}
