// Statically load all "local" components that aren't yet in the npm package

import { AppShellComponent } from './src/app/_components/override-sdk/template/app-shell/app-shell.component';
import { WssNavBarComponent } from 'src/app/_components/override-sdk/template/wss-nav-bar/wss-nav-bar.component';
import { BannerComponent } from 'src/app/_components/override-sdk/designSystemExtension/banner/banner.component';
/* import end - DO NOT REMOVE */

// localSdkComponentMap is the JSON object where we'll store the components that are
// found locally. If not found here, we'll look in the Pega-provided component map

const localSdkComponentMap = {
  AppShell: AppShellComponent,
  WssNavBar: WssNavBarComponent,
  Banner: BannerComponent
  /* map end - DO NOT REMOVE */
};

export default localSdkComponentMap;
