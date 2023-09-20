import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentMapperComponent } from '@pega/angular-sdk-library';

declare const window: any;

@Component({
  selector: 'app-material-summary-list',
  templateUrl: './material-summary-list.component.html',
  styleUrls: ['./material-summary-list.component.scss'],
  standalone: true,
  imports: [CommonModule, forwardRef(() => ComponentMapperComponent)]
})
export class MaterialSummaryListComponent implements OnInit {
  @Input() arItems$: Array<any>;
  @Input() icon$: string;
  @Input() menuIconOverride$: string = '';
  @Input() menuIconOverrideAction$: any;

  PCore$: any;

  constructor() {}

  ngOnInit(): void {
    if (!this.PCore$) {
      this.PCore$ = window.PCore;
    }
  }
}
