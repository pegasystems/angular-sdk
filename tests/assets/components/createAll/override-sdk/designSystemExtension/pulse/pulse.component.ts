import { Component, OnInit, Input } from '@angular/core';
import { FeedContainerComponent } from '@pega/angular-sdk-library';

declare const window: any;

@Component({
  selector: 'app-pulse',
  templateUrl: './pulse.component.html',
  styleUrls: ['./pulse.component.scss'],
  standalone: true,
  imports: [FeedContainerComponent]
})
export class PulseComponent implements OnInit {
  @Input() pConn$: any;

  PCore$: any;

  configProps$: Object;
  currentUser$: string;
  currentUserInitials$: string = '--';

  constructor() {}

  ngOnInit() {
    if (!this.PCore$) {
      this.PCore$ = window.PCore;
    }

    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());
    //this.currentUser$ = this.configProps$["currentUser"];
    this.currentUser$ = this.PCore$.getEnvironmentInfo().getOperatorName();

    if (this.currentUser$ != '') {
      this.currentUserInitials$ = this.currentUser$.charAt(0);

      if (this.currentUser$.lastIndexOf(' ') > 0) {
        let lastName = this.currentUser$.substring(this.currentUser$.lastIndexOf(' ') + 1);
        this.currentUserInitials$ += lastName.charAt(0);
      } else if (this.currentUser$.lastIndexOf('.') > 0) {
        let lastName = this.currentUser$.substring(this.currentUser$.lastIndexOf('.') + 1);
        this.currentUserInitials$ += lastName.charAt(0);
      }
    }
  }
}
