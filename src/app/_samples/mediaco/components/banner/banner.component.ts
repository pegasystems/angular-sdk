import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { Component, Input, forwardRef } from '@angular/core';
import { PortalModule, TemplatePortal } from '@angular/cdk/portal';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ComponentMapperComponent } from '@pega/angular-sdk-components';
import { PortalService } from '../../services/portal.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  imports: [CommonModule, PortalModule, forwardRef(() => ComponentMapperComponent)]
})
export class BannerComponent {
  @Input() pConn$: typeof PConnect;
  @Input() formGroup$: FormGroup;

  @Input() arChildren$: any[];
  @Input() configProps$: any;
  @Input() title: string;
  @Input() message: any;
  @Input() backgroundImage: string;
  @Input() layout$: string;

  portal$: Observable<TemplatePortal<any> | null>;

  constructor(private portalService: PortalService) {}

  ngOnInit() {
    this.portal$ = this.portalService.getPortal().pipe(delay(0));
  }

  getUrl() {
    return `url(${this.backgroundImage})`;
  }
}
