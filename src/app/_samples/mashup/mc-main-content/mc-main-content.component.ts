import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentMapperComponent } from '@pega/angular-sdk-components';

@Component({
  selector: 'app-mc-main-content',
  templateUrl: './mc-main-content.component.html',
  styleUrls: ['./mc-main-content.component.scss'],
  standalone: true,
  imports: [CommonModule, ComponentMapperComponent]
})
export class MCMainContentComponent implements OnInit {
  @Input() pConn$: typeof PConnect;

  sComponentName$: string;

  ngOnInit(): void {
    if (this.pConn$) {
      this.sComponentName$ = this.pConn$.getComponentName();
    }
  }
}
