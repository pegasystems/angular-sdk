import { Component } from '@angular/core';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  imports: [MatIcon, MatDividerModule, MatListModule],
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    // Register your custom SVG icons
    // You would typically have these SVG files in your assets folder
    this.matIconRegistry.addSvgIcon('facebook', this.domSanitizer.bypassSecurityTrustResourceUrl('constellation/assets/icons/facebook.svg'));
    this.matIconRegistry.addSvgIcon('twitter', this.domSanitizer.bypassSecurityTrustResourceUrl('constellation/assets/icons/twitter.svg'));
    this.matIconRegistry.addSvgIcon('instagram', this.domSanitizer.bypassSecurityTrustResourceUrl('constellation/assets/icons/instagram.svg'));
    this.matIconRegistry.addSvgIcon('youtube', this.domSanitizer.bypassSecurityTrustResourceUrl('constellation/assets/icons/youtube.svg'));
  }
}
