import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ComponentMapperComponent } from '@pega/angular-sdk-library';

@Component({
  selector: 'app-single-reference-readonly',
  templateUrl: './single-reference-readonly.component.html',
  styleUrls: ['./single-reference-readonly.component.scss'],
  standalone: true,
  imports: [forwardRef(() => ComponentMapperComponent)]
})
export class SingleReferenceReadonlyComponent implements OnInit {
  @Input() pConn$: any;
  @Input() formGroup$: FormGroup;

  ngOnInit(): void {}
}
