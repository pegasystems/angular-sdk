import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-boundary',
  templateUrl: './error-boundary.component.html',
  styleUrls: ['./error-boundary.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ErrorBoundaryComponent {
  @Input('message') message: string;
}
