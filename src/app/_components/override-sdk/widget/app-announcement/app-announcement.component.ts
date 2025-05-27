import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

interface AppAnnouncementProps {
  // If any, enter additional props that only exist on this component
  header?: string;
  description?: string;
  whatsnewlink?: string;
  label?: string;
  datasource?: any;
}

@Component({
  selector: 'app-app-announcement',
  templateUrl: './app-announcement.component.html',
  styleUrls: ['./app-announcement.component.scss'],
  standalone: true,
  imports: [CommonModule, MatButtonModule]
})
export class AppAnnouncementComponent implements OnInit {
  @Input() pConn$: typeof PConnect;

  configProps$: AppAnnouncementProps;
  details$: any[];

  ngOnInit(): void {
    this.configProps$ = this.pConn$.getConfigProps();
    const { datasource } = this.configProps$;

    if (datasource?.source) {
      this.details$ = datasource.source.map(item => item.name);
    }
  }
}
