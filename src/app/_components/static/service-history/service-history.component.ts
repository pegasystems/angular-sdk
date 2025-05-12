import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-service-history',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule],
  templateUrl: './service-history.component.html',
  styleUrls: ['./service-history.component.scss']
})
export class ServiceHistoryComponent {
  @Input() heading;
  @Input() data;

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
}
