import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewContainerComponent } from '@pega/angular-sdk-components/lib/src/app/_components/infra/Containers/view-container';

@Component({
  selector: 'app-mc-main-content',
  templateUrl: './mc-main-content.component.html',
  styleUrls: ['./mc-main-content.component.scss'],
  standalone: true,
  imports: [CommonModule, ViewContainerComponent]
})
export class MCMainContentComponent implements OnInit {
  @Input() pConn$: any;

  sComponentName$: string;

  constructor() {}

  ngOnInit(): void {
    if (this.pConn$) {
      this.sComponentName$ = this.pConn$.getComponentName();
    }
  }
}
