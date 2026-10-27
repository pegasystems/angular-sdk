import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PlanOption {
  name: string;
  imageSrc: string;
  saveAmount: string;
  monthlyPrice: string;
  tenure: string;
  retailPrice: string;
}

@Component({
  selector: 'app-shopping-card',
  imports: [CommonModule],
  templateUrl: './shopping-card.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./shopping-card.component.scss', '../EmbeddedStyles.scss']
})
export class ShoppingCardComponent {
  @Input() option: PlanOption;

  @Output() buyNowClick: EventEmitter<string> = new EventEmitter<string>();

  onBuyNowClick(level: string): void {
    this.buyNowClick.emit(level);
  }
}
