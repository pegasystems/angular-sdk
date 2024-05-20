import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
// import { Button } from '@angular/material'

@Component({
  selector: 'wss-quick-create',
  templateUrl: './wss-quick-create.component.html',
  styleUrls: ['./wss-quick-create.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class WssQuickCreateComponent {
  @Input() actions$: any;
  @Input() heading$: any;
}
