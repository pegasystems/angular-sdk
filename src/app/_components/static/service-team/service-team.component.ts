import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-service-team',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule],
  templateUrl: './service-team.component.html',
  styleUrls: ['./service-team.component.scss']
})
export class ServiceTeamComponent {
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
    }
  ];
}
