/* eslint-disable @typescript-eslint/no-useless-constructor */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// declare let require: any;

// const default_site = require('../../site-config/default_settings.json');

// if (!localStorage.getItem('site')) {
//   localStorage.setItem('site', JSON.stringify(default_site));
// }

@Component({
  selector: 'app-landing-footer',
  templateUrl: './landing-footer.component.html',
  styleUrls: ['./landing-footer.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class LandingFooterComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}
  storage = JSON.parse(`${localStorage.getItem('site')}`);
  i18n = this.storage.i18n.find(x => x.locale === this.storage.currentLocale);
  ngOnInit(): void {
    console.log('LandingFooterComponent', this.i18n);
  }
}
