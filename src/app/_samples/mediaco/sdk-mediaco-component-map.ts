// Statically load all "MediaCo" components.
import { AppShellComponent } from './components/app-shell/app-shell.component';
import { BannerComponent } from './components/banner/banner.component';
import { ListViewComponent } from './components/list-view/list-view.component';
import { QuickCreateComponent } from './components/quick-create/quick-create.component';
import { WssNavBarComponent } from './components/wss-nav-bar/wss-nav-bar.component';

/* import end - DO NOT REMOVE */

// sdkMediaCoComponentMap is the JSON object where we'll store the components that are
// specific to MediaCo application.

const sdkMediaCoComponentMap = {
  AppShell: AppShellComponent,
  Banner: BannerComponent,
  ListView: ListViewComponent,
  QuickCreate: QuickCreateComponent,
  WssNavBar: WssNavBarComponent
  /* map end - DO NOT REMOVE */
};

export default sdkMediaCoComponentMap;
