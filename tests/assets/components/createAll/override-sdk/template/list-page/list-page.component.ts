import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ComponentMapperComponent } from '@pega/angular-sdk-library';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.scss'],
  standalone: true,
  imports: [forwardRef(() => ComponentMapperComponent)]
})
export class ListPageComponent implements OnInit {
  @Input() pConn$: any;

  constructor() {}

  ngOnInit(): void {}
}
