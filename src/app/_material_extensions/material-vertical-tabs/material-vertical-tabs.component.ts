import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';


@Component({
  selector: 'app-material-vertical-tabs',
  templateUrl: './material-vertical-tabs.component.html',
  styleUrls: ['./material-vertical-tabs.component.scss']
})
export class MaterialVerticalTabsComponent implements OnInit {

  @Input() tabConfig$: Array<any>;
  @Output() TabClick: EventEmitter<any> = new EventEmitter();
  
  selectedTabId$ : any;

  constructor() { }

  ngOnInit(): void {

    // tabConfig$  [ {name: , id: , count: }]
    
    if (this.tabConfig$) {
      // seletedTabId is the first tab, unless another is selected
      this.selectedTabId$ = this.tabConfig$[0].id;

      // run through and see anything is selected
      for (let i in this.tabConfig$) {
        let aTab = this.tabConfig$[i];
        if (aTab.selected) {
          this.selectedTabId$ = aTab.id;
          break;
        }
      }
    }


  }

  onChange(tab : any) {
    this.TabClick.emit(tab);
  }

}
