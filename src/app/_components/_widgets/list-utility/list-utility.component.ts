import { Component, OnInit, Input } from '@angular/core';
import { Utils } from '../../../_helpers/utils';

@Component({
  selector: 'app-list-utility',
  templateUrl: './list-utility.component.html',
  styleUrls: ['./list-utility.component.scss'],
})
export class ListUtilityComponent implements OnInit {
  @Input() name$: string = '';
  @Input() icon$: string = '';
  @Input() bLoading$: boolean = false;
  @Input() count$: number = 0;
  @Input() arActions$: Array<any> = [];
  @Input() arItems$: Array<any> = [];

  // function to all
  @Input() onViewAll$: any;

  PCore$: any;

  headerSvgIcon$: string;
  settingsSvgIcon$: string;

  noItemsMessage$: string = 'No Items';

  imagePath$: string = '';

  constructor(private utils: Utils) {}

  ngOnInit(): void {
    if (!this.PCore$) {
      this.PCore$ = window.PCore;
    }

    this.imagePath$ = this.getIconPath();

    this.headerSvgIcon$ = this.utils.getImageSrc(this.icon$, this.utils.getSDKStaticContentUrl());
    this.settingsSvgIcon$ = this.utils.getImageSrc('more', this.utils.getSDKStaticContentUrl());
  }

  ngOnChanges() {}

  getIconPath(): string {
    return this.utils.getSDKStaticContentUrl() + 'assets/icons/';
  }
}
