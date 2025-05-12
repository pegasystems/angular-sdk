import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @Input() pConn$: typeof PConnect;
  @Input() formGroup$: FormGroup;

  data;
  configProps$;

  ngOnInit() {
    document.getElementsByClassName('appshell-top')[0].classList.remove('tradein-bg');
    document.getElementsByClassName('appshell-top')[0].classList.remove('uplusauto');
    document.getElementsByClassName('appshell-top')[0].classList.add('profile');

    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());

    this.getDataPage(this.configProps$.dtPage);
  }

  getDataPage(dataPage) {
    const context = this.pConn$.getContextName();

    (PCore.getDataApiUtils().getData(dataPage, {}, context) as any).then(response => {
      console.log(response);
      if (response.data.data !== null) {
        console.log(response.data.data[0]);
        this.data = response.data.data[0];
      }
    });
  }
}
