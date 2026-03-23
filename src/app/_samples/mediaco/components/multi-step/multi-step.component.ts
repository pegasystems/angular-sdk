import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { Utils, ComponentMapperComponent } from '@pega/angular-sdk-components';

@Component({
  selector: 'app-multi-step',
  templateUrl: './multi-step.component.html',
  styleUrls: ['./multi-step.component.scss'],
  providers: [Utils],
  imports: [CommonModule, forwardRef(() => ComponentMapperComponent)]
})
export class MultiStepComponent implements OnInit {
  @Input() pConn$: typeof PConnect;
  @Input() formGroup$: FormGroup;
  @Input() arMainButtons$: any[];
  @Input() arSecondaryButtons$: any[];
  @Input() arChildren$: any[];
  @Input() bIsVertical$: boolean;
  @Input() arCurrentStepIndicies$: number[];
  @Input() arNavigationSteps$: any[];
  @Output() actionButtonClick: EventEmitter<any> = new EventEmitter();

  svgCurrent$: string;
  svgNotCurrent$: string;
  bShow$ = true;

  constructor(private utils: Utils) {}

  ngOnInit(): void {
    // svg icons
    this.svgCurrent$ = this.utils.getImageSrc('circle-solid', this.utils.getSDKStaticContentUrl());
    this.svgNotCurrent$ = this.utils.getImageSrc('circle-solid', this.utils.getSDKStaticContentUrl());
  }

  onActionButtonClick(oData: any) {
    this.actionButtonClick.emit(oData);
  }

  _getVIconClass(status): string {
    if (status == 'current') {
      return 'psdk-vertical-step-icon-selected';
    }

    return 'psdk-vertical-step-icon';
  }

  _getVLabelClass(status): string {
    if (status == 'current') {
      return 'psdk-vertical-step-label-selected';
    }

    return 'psdk-vertical-step-label';
  }

  _getVBodyClass(index: number): string {
    if (index < this.arNavigationSteps$.length - 1) {
      return 'psdk-vertical-step-body psdk-vertical-step-line';
    }

    return 'psdk-vertical-step-body';
  }

  _getHIconClass(status): string {
    if (status == 'current') {
      return 'psdk-icon-current';
    }

    if (status == 'success') {
      return 'psdk-icon-visited';
    }

    return 'psdk-icon-future';
  }

  _getHLabelClass(status): string {
    if (status == 'current') {
      return 'psdk-label-current';
    }

    if (status == 'success') {
      return 'psdk-label-visited';
    }

    return 'psdk-label-future';
  }

  _showHLine(index: number): boolean {
    return index < this.arNavigationSteps$.length - 1;
  }
}
