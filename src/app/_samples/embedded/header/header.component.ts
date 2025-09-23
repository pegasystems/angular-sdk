import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule]
})
export class HeaderComponent implements OnInit {
  applicationLabel: string | undefined;

  ngOnInit() {
    this.applicationLabel = PCore.getEnvironmentInfo().getApplicationLabel();
  }
}
