// Statically load all "MediaCo" components.

import { AppShellComponent } from 'src/app/_samples/mediaco/components/app-shell/app-shell.component';
import { BannerComponent } from 'src/app/_samples/mediaco/components/banner/banner.component';
import { WssNavBarComponent } from 'src/app/_samples/mediaco/components/wss-nav-bar/wss-nav-bar.component';

/* import end - DO NOT REMOVE */

// sdkMediaCoComponentMap is the JSON object where we'll store the components that are
// specific to MediaCo application.

const sdkMediaCoComponentMap = {
  AppShell: AppShellComponent,
  WssNavBar: WssNavBarComponent,
  Banner: BannerComponent
  /* map end - DO NOT REMOVE */
};

export default sdkMediaCoComponentMap;
