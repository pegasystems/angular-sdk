import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-material-summary-list',
  templateUrl: './material-summary-list.component.html',
  styleUrls: ['./material-summary-list.component.scss']
})
export class MaterialSummaryListComponent implements OnInit {

  constructor() { }

  @Input() arItems$: Array<any>;
  @Input() icon$: string;

  @Input() menuIconOverride$: string = "";
  @Input() menuIconOverrideAction$: any;

  PCore$: any;

  ngOnInit(): void {

    if (!this.PCore$) {
      this.PCore$ = window.PCore;
    }

  }

}
