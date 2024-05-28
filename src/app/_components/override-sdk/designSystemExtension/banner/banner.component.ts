import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { Component, Input, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { ComponentMapperComponent } from '@pega/angular-sdk-components';
import { ServiceCardComponent } from '../service-card/service-card.component';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  standalone: true,
  imports: [CommonModule, ServiceCardComponent, forwardRef(() => ComponentMapperComponent)]
})
export class BannerComponent implements OnInit, OnDestroy {
  @Input() pConn$: typeof PConnect;
  @Input() formGroup$: FormGroup;

  @Input() arChildren$: any[];
  @Input() title: string;
  @Input() message: any;
  @Input() backgroundImage: string;
  @Input() layout$: string;

  ngOnInit() {
    console.log('ngOnInit');
    document.getElementsByClassName('appshell-top')[0].classList.remove('form-bg');
  }

  ngOnDestroy() {
    document.getElementsByClassName('appshell-top')[0].classList.add('form-bg');
  }
}
