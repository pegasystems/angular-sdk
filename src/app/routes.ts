import { Routes } from '@angular/router';
import { endpoints } from '@pega/angular-sdk-components';
import { FullPortalComponent } from './_samples/full-portal/full-portal.component';
import { EmbeddedComponent } from './_samples/embedded/embedded.component';
import { NavigationComponent } from './_samples/simple-portal/navigation/navigation.component';

// Adding path to remove "Cannot match routes" error at launch
// Tried this at one point... Need to add /app in path now...
// const appName = PCore.getStore().getState().data.app.Application.pyLabel;
// Unfortunately, called before onPCoreReady...
//
// But we can get it from window.location.pathname

// const appName = window.location.pathname.split('/')[3];

export const routes: Routes = [
  { path: '', component: EmbeddedComponent },
  { path: 'portal', component: FullPortalComponent },
  // { path: '**', component: FullPortalComponent },
  { path: endpoints.PORTALHTML, component: FullPortalComponent },
  { path: endpoints.FULLPORTAL, component: FullPortalComponent },
  { path: endpoints.FULLPORTALHTML, component: FullPortalComponent },
  { path: endpoints.EMBEDDED, component: EmbeddedComponent },
  { path: endpoints.EMBEDDEDHTML, component: EmbeddedComponent },
  { path: endpoints.MASHUP, component: EmbeddedComponent },
  { path: endpoints.MASHUPHTML, component: EmbeddedComponent },
  { path: endpoints.SIMPLEPORTAL, component: NavigationComponent },
  { path: endpoints.SIMPLEPORTALHTML, component: NavigationComponent }
];
