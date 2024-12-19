import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-shopping-card',
  templateUrl: './shopping-card.component.html',
  styleUrls: ['./shopping-card.component.scss'],
  standalone: true
})
export class ShoppingCardComponent {
  @Input() option: any;
  @Output() onShopNowButtonClick: EventEmitter<any> = new EventEmitter();

  onShopNowClick(sLevel) {
    this.onShopNowButtonClick.emit(sLevel);
  }
}
