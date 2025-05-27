import { Component, OnInit, Input, forwardRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { ReferenceComponent } from '@pega/angular-sdk-components';
import { ComponentMapperComponent } from '@pega/angular-sdk-components';

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.scss'],
  standalone: true,
  imports: [CommonModule, forwardRef(() => ComponentMapperComponent)]
})
export class RegionComponent implements OnInit, OnChanges {
  @Input() pConn$: typeof PConnect;
  @Input() formGroup$: FormGroup;
  @Input() fromBanner: boolean;
  arChildren$: any[];

  ngOnInit() {
    // console.log(`ngOnInit (no registerAndSubscribe!): Region`);
    this.updateSelf();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { pConn$ } = changes;

    if (pConn$.previousValue && pConn$.previousValue !== pConn$.currentValue) {
      this.updateSelf();
    }
  }

  updateSelf() {
    // The children may contain 'reference' components, so normalize the children...
    if (this.fromBanner) {
      // @ts-ignore
      this.arChildren$ = ReferenceComponent.normalizePConnArray(this.pConn$._children);
    } else {
      this.arChildren$ = ReferenceComponent.normalizePConnArray(this.pConn$.getChildren());
    }

    console.log('RegionComponent arChildren$', this.arChildren$);
  }
}
