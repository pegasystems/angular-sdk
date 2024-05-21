import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
// import { Button } from '@angular/material'

@Component({
  selector: 'wss-quick-create',
  templateUrl: './wss-quick-create.component.html',
  styleUrls: ['./wss-quick-create.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule]
})
export class WssQuickCreateComponent {
  @Input() actions$: any;
  @Input() heading$: any;
}
