import { Component, OnInit, Input, forwardRef, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { RegionComponent } from '@pega/angular-sdk-library';

@Component({
  selector: 'app-narrow-wide-form',
  templateUrl: './narrow-wide-form.component.html',
  styleUrls: ['./narrow-wide-form.component.scss'],
  standalone: true,
  imports: [CommonModule, forwardRef(() => RegionComponent)]
})
export class NarrowWideFormComponent implements OnInit {
  @Input() pConn$: any;
  @Input() formGroup$: FormGroup;

  configProps$: Object;
  arChildren$: Array<any>;

  constructor() {}

  ngOnInit() {
    this.updateSelf();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { pConn$ } = changes;

    if (pConn$.previousValue && pConn$.previousValue !== pConn$.currentValue) {
      this.updateSelf();
    }
  }

  updateSelf() {
    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());
    this.arChildren$ = this.pConn$.getChildren();
  }
}
