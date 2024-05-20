// Statically load all "local" components that aren't yet in the npm package

import { WssNavBarComponent } from 'src/app/_components/override-sdk/template/wss-nav-bar/wss-nav-bar.component';
import { BannerComponent } from 'src/app/_components/override-sdk/designSystemExtension/banner/banner.component';
import { WssQuickCreateComponent } from 'src/app/_components/override-sdk/designSystemExtension/wss-quick-create/wss-quick-create.component';
/* import end - DO NOT REMOVE */

// localSdkComponentMap is the JSON object where we'll store the components that are
// found locally. If not found here, we'll look in the Pega-provided component map

const localSdkComponentMap = {
  WssNavBar: WssNavBarComponent,
  Banner: BannerComponent,
  WssQuickCreate: WssQuickCreateComponent
  /* map end - DO NOT REMOVE */
};

export default localSdkComponentMap;
