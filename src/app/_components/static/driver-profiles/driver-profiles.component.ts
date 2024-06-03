import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-driver-profiles',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule],
  templateUrl: './driver-profiles.component.html',
  styleUrls: ['./driver-profiles.component.scss']
})
export class DriverProfilesComponent {
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
