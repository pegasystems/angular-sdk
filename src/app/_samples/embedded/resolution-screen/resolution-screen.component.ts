import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-resolution-screen',
  templateUrl: './resolution-screen.component.html',
  styleUrls: ['./resolution-screen.component.scss', '../EmbeddedStyles.scss'],
  imports: [CommonModule]
})
export class ResolutionScreenComponent implements OnInit {
  modelName = 'your new phone';
  address = 'your address';
  email = 'you';
  constructor() {}
  ngOnInit(): void {
    const primaryContainer = PCore.getContainerUtils().getActiveContainerItemName('app/primary') || 'app/primary_1';
    const workareaContainer = PCore.getContainerUtils().getActiveContainerItemName(primaryContainer + '/workarea') || 'app/primary_1/workarea_1';
    this.modelName = PCore.getStoreValue('.PhoneModelss.ModelName', 'caseInfo.content', workareaContainer) || this.modelName;
    this.address = PCore.getStoreValue('.BillingAddress.Apartment', 'caseInfo.content', workareaContainer) || this.address;
    this.email = PCore.getStoreValue('.CustomerProfile.EmailAddress', 'caseInfo.content', workareaContainer) || this.email;
  }
}
