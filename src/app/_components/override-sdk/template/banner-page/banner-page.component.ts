import { Component, Input, OnChanges, OnInit, SimpleChanges, forwardRef } from '@angular/core';

import { ReferenceComponent } from '@pega/angular-sdk-components';
import { CommonModule } from '@angular/common';
import { ComponentMapperComponent } from '@pega/angular-sdk-components';

interface BannerPageProps {
  // If any, enter additional props that only exist on this component
  layout?: string;
  title?: string;
  message?: string;
  backgroundImage?: string;
}

@Component({
  selector: 'app-banner-page',
  templateUrl: './banner-page.component.html',
  styleUrls: ['./banner-page.component.scss'],
  standalone: true,
  imports: [CommonModule, forwardRef(() => ComponentMapperComponent)]
})
export class BannerPageComponent implements OnInit, OnChanges {
  @Input() pConn$: typeof PConnect;
  @Input() formGroup$: any;

  configProps$: BannerPageProps;
  arChildren$: any[];
  title?: string;
  message: any;
  backgroundImage?: string;
  layout$?: string;
  divClass$: string;

  constructor() {
    this.backgroundImage = this.configProps$?.backgroundImage;
  }

  ngOnInit() {
    // console.log(`ngOnInit (no registerAndSubscribe!): Region`);
    this.backgroundImage = this.configProps$?.backgroundImage;
    this.updateSelf();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { pConn$ } = changes;
    this.backgroundImage = this.configProps$?.backgroundImage;

    if (pConn$.previousValue && pConn$.previousValue !== pConn$.currentValue) {
      this.updateSelf();
    }
  }

  updateSelf() {
    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps()) as BannerPageProps;
    console.log(`url(${this.backgroundImage})`);

    this.layout$ = this.configProps$.layout;
    this.title = this.configProps$.title;
    this.message = this.configProps$.message;
    this.backgroundImage = this.configProps$.backgroundImage;

    // The children may contain 'reference' components, so normalize the children...
    this.arChildren$ = ReferenceComponent.normalizePConnArray(this.pConn$.getChildren());
  }
}
