import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';

declare const window: any;

@Component({
  selector: 'app-field-value-list',
  templateUrl: './field-value-list.component.html',
  styleUrls: ['./field-value-list.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class FieldValueListComponent implements OnInit{

  @Input() label$: any;
  @Input() value$: any;
  @Input() displayMode$: any;
  PCore$: any;

  angularPConnectData: any = {};
  configProps$: any;
  pConn$: any;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges() {}

  updateSelf() {} 
}
