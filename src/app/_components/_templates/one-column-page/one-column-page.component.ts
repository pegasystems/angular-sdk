import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProgressSpinnerService } from "../../../_messages/progress-spinner.service";

@Component({
  selector: 'app-one-column-page',
  templateUrl: './one-column-page.component.html',
  styleUrls: ['./one-column-page.component.scss']
})
export class OneColumnPageComponent implements OnInit {

  @Input() pConn$: any;
  @Input() formGroup$: FormGroup;

  constructor(private psService: ProgressSpinnerService) { }

  ngOnInit(): void {

  }

}
