import { Routes } from '@angular/router';
import { FullPortalComponent } from './_samples/full-portal/full-portal.component';
import { EmbeddedComponent } from './_samples/embedded/embedded.component';

const routePaths = {
  portal: 'portal',
  portalHtml: 'portal.html',
  fullPortal: 'fullportal',
  fullPortalHtml: 'fullportal.html',
  embedded: 'embedded',
  embeddedHtml: 'embedded.html',
  mashup: 'mashup',
  mashupHtml: 'mashup.html'
};

// Adding path to remove "Cannot match routes" error at launch
// Tried this at one point... Need to add /app in path now...
// const appName = PCore.getStore().getState().data.app.Application.pyLabel;
// Unfortunately, called before onPCoreReady...
//
// But we can get it from window.location.pathname

// const appName = window.location.pathname.split('/')[3];

export const routes: Routes = [
  { path: '', component: EmbeddedComponent },
  { path: routePaths.portal, component: FullPortalComponent },
  { path: routePaths.portalHtml, component: FullPortalComponent },
  { path: routePaths.fullPortal, component: FullPortalComponent },
  { path: routePaths.fullPortalHtml, component: FullPortalComponent },
  { path: routePaths.embedded, component: EmbeddedComponent },
  { path: routePaths.embeddedHtml, component: EmbeddedComponent },
  { path: routePaths.mashup, component: EmbeddedComponent },
  { path: routePaths.mashupHtml, component: EmbeddedComponent }
];
