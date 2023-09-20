import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '@pega/angular-sdk-library';

@Component({
  selector: 'app-alert-banner',
  templateUrl: './alert-banner.component.html',
  styleUrls: ['./alert-banner.component.scss'],
  standalone: true,
  imports: [CommonModule, AlertComponent]
})
export class AlertBannerComponent implements OnInit {
  constructor() { }

  @Input() banners: Array<any>;

  SEVERITY_MAP = {
    urgent: 'error',
    warning: 'warning',
    success: 'success',
    info: 'info'
  };

  ngOnInit(): void { }

  onAlertClose(config) {
    const { PAGE, type, target } = config
    const { clearMessages } = window.PCore.getMessageManager();
    clearMessages({ category: PAGE, type, context: target });
  }

}
