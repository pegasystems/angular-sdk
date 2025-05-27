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
  fromBanner: boolean;
  ngOnInit() {
    console.log('BannerComponent initialized with title:ngOnInit', this.title);
    if (this.landingPageName === 'customerself-servicehomepage' || this.landingPageName === 'u+connect') {
      this.updateChildren();
    }
    document.getElementsByClassName('appshell-top')[0].classList.remove('form-bg');
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('BannerComponent changes:', changes);
    const { title } = changes;
    this.fromBanner = false;
    let { currentValue } = title;
    currentValue = currentValue ? currentValue.toLocaleLowerCase().replace(/\s/g, '') : '';
    // previousValue = previousValue ? previousValue.toLocaleLowerCase().replace(/\s/g, '') : '';
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
    if (currentValue === 'customerself-servicehomepage' || currentValue === 'u+connect') {
      this.updateChildren();
    }
  }

  updateChildren() {
    this.fromBanner = true;
    const tempRegion1 = [...this.arChildren$[0].getPConnect().getChildren()];
    const tempRegion2 = [...this.arChildren$[1].getPConnect().getChildren()];
    const [ref] = tempRegion2.splice(1, 1);
    this.arChildren$[0].getPConnect()._children = tempRegion2;
    this.arChildren$[1].getPConnect()._children = [...tempRegion1, ref];
  }

  ngOnDestroy() {
    document.getElementsByClassName('appshell-top')[0].classList.add('form-bg');
  }
}
