import { Component, OnInit, Input } from '@angular/core';
import { Utf8AsciiBinaryEncoding } from 'crypto';
import { Utils } from "../../_helpers/utils";

@Component({
  selector: 'app-material-summary-item',
  templateUrl: './material-summary-item.component.html',
  styleUrls: ['./material-summary-item.component.scss']
})
export class MaterialSummaryItemComponent implements OnInit {

  @Input() item$: any;
  @Input() PCore$: any;

  @Input() menuIconOverride$: string = "";
  @Input() menuIconOverrideAction$: any;


  headerSvgIcon$: string;
  settingsSvgIcon$: string;
  imagePath$ : string = "";

  constructor(private utils: Utils) { }

  ngOnInit(): void {

    this.imagePath$ = this.utils.getIconPath(this.PCore$.getAssetLoader().getStaticServerUrl());

    this.settingsSvgIcon$ = this.utils.getImageSrc("more", this.PCore$.getAssetLoader().getStaticServerUrl());
    if (this.menuIconOverride$ != "") {
      this.menuIconOverride$ = this.utils.getImageSrc(this.menuIconOverride$ , this.PCore$.getAssetLoader().getStaticServerUrl());
    }

  }



}
