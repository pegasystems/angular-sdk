import { Routes } from '@angular/router';
import { endpoints } from '@pega/angular-sdk-components';
import { TopAppMashupComponent } from './_samples/full-portal/top-app-mashup/top-app-mashup.component';
import { NavigationComponent } from './_samples/simple-portal/navigation/navigation.component';
import { MCNavComponent } from './_samples/embedded/mc-nav/mc-nav.component';

// Adding path to remove "Cannot match routes" error at launch
//  Tried this at one point... Need to add /app in path now...
// const appName = window.PCore.getStore().getState().data.app.Application.pyLabel;
//  Unfortunately, called before onPCoreReady...
//
// But we can get it from window.location.pathname

// const appName = window.location.pathname.split('/')[3];

// TopAppComponent no longer used (was for when login into PegaInfinity and being directed from there to an Angular app,
// similiar to Nebula/Constellaion)

export const routes: Routes = [
  { path: '', component: MCNavComponent },
  { path: endpoints.PORTAL, component: TopAppMashupComponent },
  { path: endpoints.PORTALHTML, component: TopAppMashupComponent },
  { path: endpoints.FULLPORTAL, component: TopAppMashupComponent },
  { path: endpoints.FULLPORTALHTML, component: TopAppMashupComponent },
  { path: endpoints.SIMPLEPORTAL, component: NavigationComponent },
  { path: endpoints.SIMPLEPORTALHTML, component: NavigationComponent },
  { path: endpoints.EMBEDDED, component: MCNavComponent },
  { path: endpoints.EMBEDDEDHTML, component: MCNavComponent },
  { path: endpoints.MASHUP, component: MCNavComponent },
  { path: endpoints.MASHUPHTML, component: MCNavComponent }
];
