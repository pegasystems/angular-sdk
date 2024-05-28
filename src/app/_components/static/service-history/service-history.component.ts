import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-service-history',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule],
  templateUrl: './service-history.component.html',
  styleUrls: ['./service-history.component.scss']
})
export class ServiceHistoryComponent {
  folders: any[] = [
    {
      title: 'Scheduled maintenance',
      description: 'Oil Change, Tire rotation, Check fluids'
    },
    {
      title: 'Recall service',
      description: 'Performed Service Campain #A12B3 - Faulty window motor'
    },
    {
      title: 'Service appointment',
      description: 'Replaced front left rotor and brake pads, windshield wipers, and investigated rattle near driver’s side window.'
    }
  ];

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon('wrench', this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/pw/wrench.svg'));
  }
}
