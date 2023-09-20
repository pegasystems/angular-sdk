import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule]
})
export class AlertComponent implements OnInit {
  constructor() { }

  @Input() message: Array<any>;
  @Input() severity;
  @Input() hideClose;
  @Output() onClose: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void { }

  getMatIcon(severity) {
    let variant;
    switch (severity) {
      case 'error':
        variant = 'error_outline';
        break;
      case 'warning':
        variant = 'warning_amber';
        break;
      case 'success':
        variant = 'task_alt';
        break;
      case 'info':
        variant = 'info_outline';
        break;
    }
    return variant;
  }

  onCloseClick() {
    this.onClose.emit();
  }

}