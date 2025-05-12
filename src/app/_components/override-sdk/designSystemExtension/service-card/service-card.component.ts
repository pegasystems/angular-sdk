import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
// import { Button } from '@angular/material'

@Component({
  selector: 'service-card',
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule]
})
export class ServiceCardComponent {}
