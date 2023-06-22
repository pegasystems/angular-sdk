import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import RootContainerComponent from '@pega/angular-sdk-components/lib/src/app/_components/infra/root-container';
import ViewContainerComponent from '@pega/angular-sdk-components/lib/src/app/_components/infra/Containers/view-container';

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
