import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { Component, Input, forwardRef } from '@angular/core';
import { ComponentMapperComponent } from '@pega/angular-sdk-components';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  imports: [CommonModule, forwardRef(() => ComponentMapperComponent)]
})
export class BannerComponent {
  @Input() pConn$: typeof PConnect;
  @Input() formGroup$: FormGroup;

  @Input() arChildren$: any[];
  @Input() title: string;
  @Input() message: any;
  @Input() backgroundImage: string;
  @Input() layout$: string;

  getUrl() {
    return `url(${this.backgroundImage})`;
  }
}
