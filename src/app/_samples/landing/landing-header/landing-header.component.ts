/* eslint-disable @typescript-eslint/no-useless-constructor */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LandingContentComponent } from '../landing-content/landing-content.component';
import { LandingFooterComponent } from '../landing-footer/landing-footer.component';

@Component({
  selector: 'app-landing-header',
  templateUrl: './landing-header.component.html',
  styleUrls: ['./landing-header.component.scss'],
  standalone: true,
  imports: [CommonModule, MatListModule, MatMenuModule, MatIconModule, MatToolbarModule, LandingContentComponent, LandingFooterComponent]
})
export class LandingHeaderComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}
  storage = JSON.parse(`${localStorage.getItem('site')}`);
  i18n = this.storage.i18n.find(x => x.locale === this.storage.currentLocale);
  ngOnInit(): void {
    console.log('Hi', this.i18n);
  }
}
