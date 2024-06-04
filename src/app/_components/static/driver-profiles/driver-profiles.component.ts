import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { Utils } from '@pega/angular-sdk-components';

const ICONS = ['profile1.png', 'profile2.png'];

@Component({
  selector: 'app-driver-profiles',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule],
  templateUrl: './driver-profiles.component.html',
  styleUrls: ['./driver-profiles.component.scss']
})
export class DriverProfilesComponent implements OnChanges {
  @Input() heading;
  @Input() data;

  icons;

  constructor(private utils: Utils) {}

  ngOnChanges() {
    this.icons = ICONS.map(icon => this.utils.getIconPath(this.utils.getSDKStaticContentUrl()) + icon);
  }
}
