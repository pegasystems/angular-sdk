import { Component, OnInit, Input } from '@angular/core';
import { Utils } from "../../_helpers/utils";

@Component({
  selector: 'app-material-utility',
  templateUrl: './material-utility.component.html',
  styleUrls: ['./material-utility.component.scss'],
  providers: [Utils]
})
export class MaterialUtilityComponent implements OnInit {

  @Input() headerText$: string;
  @Input() headerIcon$: string;
  @Input() headerIconUrl$: string;
  @Input() noItemsMessage$: string;

  headerSvgIcon$: string;
  settingsSvgIcon$: string;

  constructor(private utils: Utils) { }

  ngOnInit(): void {
  
    this.headerSvgIcon$ = this.utils.getImageSrc(this.headerIcon$, this.headerIconUrl$);
    this.settingsSvgIcon$ = this.utils.getImageSrc("plus", this.headerIconUrl$);

  }

}