import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RootContainerComponent } from '@pega/angular-sdk-library';
import { ViewContainerComponent } from '@pega/angular-sdk-library';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss'],
  standalone: true,
  imports: [CommonModule, ViewContainerComponent, RootContainerComponent]
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
