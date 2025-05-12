import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { Component, Input, forwardRef, OnInit, OnDestroy, SimpleChanges, OnChanges } from '@angular/core';
import { ComponentMapperComponent } from '@pega/angular-sdk-components';
import { ServiceCardComponent } from '../service-card/service-card.component';
import { HowItWorksComponent } from 'src/app/_components/static/how-it-works/how-it-works.component';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  standalone: true,
  imports: [CommonModule, ServiceCardComponent, forwardRef(() => ComponentMapperComponent), HowItWorksComponent]
})
export class BannerComponent implements OnInit, OnDestroy, OnChanges {
  @Input() pConn$: typeof PConnect;
  @Input() formGroup$: FormGroup;

  @Input() configProps$: any;
  @Input() arChildren$: any[];
  @Input() title: string;
  @Input() message: any;
  @Input() backgroundImage: string;
  @Input() layout$: string;

  landingPageName;

  ngOnInit() {
    console.log('ngOnInit');
    document.getElementsByClassName('appshell-top')[0].classList.remove('form-bg');
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes', changes);
    const { title } = changes;

    if (title.currentValue !== title.previousValue) {
      this.landingPageName = this.title.toLocaleLowerCase().replace(/\s/g, '');
      if (this.landingPageName === 'tradein') {
        document.getElementsByClassName('appshell-top')[0].classList.remove('uplusauto');
        document.getElementsByClassName('appshell-top')[0].classList.remove('profile');
        document.getElementsByClassName('appshell-top')[0].classList.add('tradein-bg');
      } else {
        document.getElementsByClassName('appshell-top')[0].classList.remove('tradein-bg');
        document.getElementsByClassName('appshell-top')[0].classList.remove('profile');
        document.getElementsByClassName('appshell-top')[0].classList.add('uplusauto');
      }
    }
  }

  ngOnDestroy() {
    document.getElementsByClassName('appshell-top')[0].classList.add('form-bg');
  }
}
