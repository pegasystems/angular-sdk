import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-field-group-list',
  templateUrl: './field-group-list.component.html',
  styleUrls: ['./field-group-list.component.scss'],
})
export class FieldGroupListComponent implements OnInit {
  @Input() item;
  @Input() heading;
  @Input() formGroup$;
  fields: any = [];

  ngOnInit(): void {}

  ngOnChanges() {}
}
