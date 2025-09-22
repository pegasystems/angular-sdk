import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentMapperComponent } from '@pega/angular-sdk-components';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss'],
  imports: [CommonModule, ComponentMapperComponent]
})
export class MainContentComponent implements OnInit {
  @Input() pConn$: typeof PConnect;

  sComponentName$: string | undefined;

  ngOnInit(): void {
    if (this.pConn$) {
      this.sComponentName$ = this.pConn$.getComponentName();
    }
  }
}
