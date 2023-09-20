import { Component, OnInit, Input, forwardRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { RegionComponent } from '@pega/angular-sdk-library';
import { ViewComponent } from '@pega/angular-sdk-library';

@Component({
  selector: 'app-two-column-tab',
  templateUrl: './two-column-tab.component.html',
  styleUrls: ['./two-column-tab.component.scss'],
  standalone: true,
  imports: [CommonModule, RegionComponent, forwardRef(() => ViewComponent)]
})
export class TwoColumnTabComponent implements OnInit, OnChanges {
  @Input() pConn$: any;
  @Input() formGroup$: FormGroup;

  configProps$: Object;
  arChildren$: Array<any>;

  constructor() {}

  ngOnInit(): void {
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
