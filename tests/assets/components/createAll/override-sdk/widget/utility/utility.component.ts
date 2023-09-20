import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Utils } from '@pega/angular-sdk-library';
import { MaterialUtilityComponent } from '@pega/angular-sdk-library';

declare const window: any;

@Component({
  selector: 'app-utility',
  templateUrl: './utility.component.html',
  styleUrls: ['./utility.component.scss'],
  standalone: true,
  imports: [MaterialUtilityComponent]
})
export class UtilityComponent implements OnInit, OnChanges {
  @Input() pConn$: any;

  PCore$: any;

  configProps$: any;
  headerIcon$: string;
  headerText$: string;
  headerIconUrl$: string;
  noItemsMessage$: string;

  constructor(private utils: Utils) {}

  ngOnInit(): void {
    if (!this.PCore$) {
      this.PCore$ = window.PCore;
    }

    this.updateSelf();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { pConn$ } = changes;

    if (pConn$.previousValue && pConn$.previousValue !== pConn$.currentValue) {
      this.updateSelf();
    }
  }

  updateSelf() {
    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());

    this.headerIcon$ = this.configProps$['headerIcon'];
    this.headerIconUrl$ = this.utils.getSDKStaticContentUrl();
    this.headerText$ = this.configProps$['headerText'];
    this.noItemsMessage$ = this.configProps$['noItemsMessage'];
  }
}
