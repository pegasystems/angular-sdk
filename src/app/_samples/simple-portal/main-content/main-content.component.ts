import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RootContainerComponent } from 'ang-sdk-comps';
import { ViewContainerComponent } from 'ang-sdk-comps';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss'],
  standalone: true,
  imports: [CommonModule, ViewContainerComponent, RootContainerComponent, ViewContainerComponent]
})
export class MainContentComponent implements OnInit {
  @Input() PCore$: any;
  @Input() pConn$: any;
  @Input() props$: any;

  sComponentName$: string;

  constructor() {}

  ngOnInit(): void {
    if (this.pConn$) {
      this.sComponentName$ = this.pConn$.getComponentName();
    }
  }
}
