import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-bundle-swatch',
  templateUrl: './bundle-swatch.component.html',
  styleUrls: ['./bundle-swatch.component.scss']
})
export class BundleSwatchComponent implements OnInit {

  constructor() { }

  @Input() swatchConfig$ : any;
  @Output() ShopNowButtonClick: EventEmitter<any> = new EventEmitter();


  labelPlay$: string;
  labelLevel$: string;
  labelChannelCount$: string;
  labelChannelFull$: string;
  labelBanner$: string;
  labelDollars$ : string;
  labelCents$ : string;
  labelInternetSpeed$: string;

  extraCalling$: string;
  

  ngOnInit(): void {

    this.labelPlay$ = this.swatchConfig$.play;
    this.labelLevel$ = this.swatchConfig$.level;
    this.labelChannelCount$ = this.swatchConfig$.channels;
    this.labelChannelFull$ = this.swatchConfig$.channels_full;
    this.labelBanner$ = this.swatchConfig$.banner;
    this.labelDollars$ = this.swatchConfig$.price.substring(0, this.swatchConfig$.price.indexOf("."));
    this.labelCents$ = this.swatchConfig$.price.substring(this.swatchConfig$.price.indexOf(".") + 1) + "/month";
    this.extraCalling$ = this.swatchConfig$.calling;
    this.labelInternetSpeed$ = this.swatchConfig$.internetSpeed;

  }

  shopClick(sLevel) {
    this.ShopNowButtonClick.emit(sLevel);
  }

}
