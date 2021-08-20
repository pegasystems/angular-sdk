import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProgressSpinnerService } from "../../../_messages/progress-spinner.service";

@Component({
  selector: 'app-three-column-page',
  templateUrl: './three-column-page.component.html',
  styleUrls: ['./three-column-page.component.scss']
})
export class ThreeColumnPageComponent implements OnInit {


  @Input() pConn$: any;
  @Input() formGroup$: FormGroup;

  constructor(private psService: ProgressSpinnerService) { }

  ngOnInit(): void {


  }

}
