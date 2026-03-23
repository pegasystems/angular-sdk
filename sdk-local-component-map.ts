// Statically load all "local" components that aren't yet in the npm package

import { CancelAlertComponent } from './src/app/_components/override-sdk/field/cancel-alert/cancel-alert.component';
/* import end - DO NOT REMOVE */

// localSdkComponentMap is the JSON object where we'll store the components that are
// found locally. If not found here, we'll look in the Pega-provided component map

const localSdkComponentMap = {
  CancelAlert: CancelAlertComponent
  /* map end - DO NOT REMOVE */
};

export default localSdkComponentMap;
