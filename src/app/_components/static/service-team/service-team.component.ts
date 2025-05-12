import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { Utils } from '@pega/angular-sdk-components';

const ICONS = ['teammate1.png', 'teammate2.png'];
@Component({
  selector: 'app-service-team',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule],
  templateUrl: './service-team.component.html',
  styleUrls: ['./service-team.component.scss']
})
export class ServiceTeamComponent implements OnChanges {
  @Input() heading;
  @Input() data;

  icons;

  constructor(private utils: Utils) {}

  ngOnChanges() {
    this.icons = ICONS.map(icon => this.utils.getIconPath(this.utils.getSDKStaticContentUrl()) + icon);
  }
}
