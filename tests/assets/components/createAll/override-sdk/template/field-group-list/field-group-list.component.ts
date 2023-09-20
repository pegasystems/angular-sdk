import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegionComponent } from '@pega/angular-sdk-library';

@Component({
  selector: 'app-field-group-list',
  templateUrl: './field-group-list.component.html',
  styleUrls: ['./field-group-list.component.scss'],
  standalone: true,
  imports: [CommonModule, forwardRef(() => RegionComponent)]
})
export class FieldGroupListComponent implements OnInit {
  @Input() item;
  @Input() heading;
  @Input() formGroup$;

  fields: any = [];

  ngOnInit(): void {}

  ngOnChanges() {}
}
