import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { Utils } from '@pega/angular-sdk-library';
import { ComponentMapperComponent } from '@pega/angular-sdk-library';

declare const window: any;

@Component({
  selector: 'app-multi-step',
  templateUrl: './multi-step.component.html',
  styleUrls: ['./multi-step.component.scss'],
  providers: [Utils],
  standalone: true,
  imports: [CommonModule, forwardRef(() => ComponentMapperComponent)]
})
export class MultiStepComponent implements OnInit {
  @Input() pConn$: any;
  @Input() formGroup$: FormGroup;
  @Input() arMainButtons$: Array<any>;
  @Input() arSecondaryButtons$: Array<any>;
  @Input() arChildren$: Array<any>;
  @Input() bIsVertical$: boolean;
  @Input() arCurrentStepIndicies$: Array<number>;
  @Input() arNavigationSteps$: Array<any>;
  @Output() actionButtonClick: EventEmitter<any> = new EventEmitter();

  PCore$: any;

  svgCurrent$: string;
  svgNotCurrent$: string;
  bShow$: boolean = true;

  constructor(private utils: Utils) {}

  ngOnInit(): void {
    if (!this.PCore$) {
      this.PCore$ = window.PCore;
    }

    // svg icons
    this.svgCurrent$ = this.utils.getImageSrc('circle-solid', this.utils.getSDKStaticContentUrl());
    this.svgNotCurrent$ = this.utils.getImageSrc('circle-solid', this.utils.getSDKStaticContentUrl());
  }

  onActionButtonClick(oData: any) {
    this.actionButtonClick.emit(oData);
  }

  _getVIconClass(status): String {
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
      return 'psdk-horizontal-step-icon-selected';
    }

    return 'psdk-horizontal-step-icon';
  }

  _getHLabelClass(status): string {
    if (status == 'current') {
      return 'psdk-horizontal-step-label-selected';
    }

    return 'psdk-horizontal-step-label';
  }

  _showHLine(index: number): boolean {
    if (index < this.arNavigationSteps$.length - 1) {
      return true;
    }

    return false;
  }
}
