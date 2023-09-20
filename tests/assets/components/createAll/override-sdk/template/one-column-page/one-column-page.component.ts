import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ComponentMapperComponent } from '@pega/angular-sdk-library';

@Component({
  selector: 'app-one-column-page',
  templateUrl: './one-column-page.component.html',
  styleUrls: ['./one-column-page.component.scss'],
  standalone: true,
  imports: [forwardRef(() => ComponentMapperComponent)]
})
export class OneColumnPageComponent implements OnInit {
  @Input() pConn$: any;
  @Input() formGroup$: FormGroup;

  constructor() {}

  ngOnInit(): void {}
}
