import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'table-template-card',
  templateUrl: './table-template-card.html',
  styleUrls: ['./table-template-card.scss'],
  imports: [MatCard, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableTemplateCardComponent {
  @Input() data!: any;
  @Input() tabindex = 0;
  @Input() index!: number;
}
