import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
// import { ComponentMapperComponent } from '@pega/angular-sdk-library';
import { ThreeColumnComponent } from '@pega/angular-sdk-library';


@Component({
  selector: 'app-three-column-page',
  templateUrl: './three-column-page.component.html',
  styleUrls: ['./three-column-page.component.scss'],
  standalone: true,
  imports: [ThreeColumnComponent]
})
export class ThreeColumnPageComponent implements OnInit {
  @Input() pConn$: any;
  @Input() formGroup$: FormGroup;

  constructor() {}

  ngOnInit(): void {}
}
