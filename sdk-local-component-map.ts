// Statically load all "local" components that aren't yet in the npm package

import sdkMediaCoComponentMap from 'sdk-mediaco-component-map';

import sdkConfig from './sdk-config.json';

import { BannerPageComponent } from './src/app/_components/override-sdk/template/banner-page/banner-page.component';
/* import end - DO NOT REMOVE */

// localSdkComponentMap is the JSON object where we'll store the components that are
// found locally. If not found here, we'll look in the Pega-provided component map

const isMediaCoApp = sdkConfig.app === 'mediaco';

const localSdkComponentMap = {
  ...(isMediaCoApp ? { ...sdkMediaCoComponentMap } : {}),
  BannerPage: BannerPageComponent
  /* map end - DO NOT REMOVE */
};

export default localSdkComponentMap;
