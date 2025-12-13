import { Injectable } from '@angular/core';
import { TemplatePortal } from '@angular/cdk/portal';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PortalService {
  private portal$ = new BehaviorSubject<TemplatePortal<any> | null>(null);

  /**
   * Sets the portal that should be rendered elsewhere.
   * @param portal The TemplatePortal to be shared.
   */
  setPortal(portal: TemplatePortal<any>) {
    this.portal$.next(portal);
  }

  /**
   * Clears the currently set portal.
   */
  clearPortal() {
    this.portal$.next(null);
  }

  /**
   * Returns the current portal as an observable.
   */
  getPortal() {
    return this.portal$.asObservable();
  }
}
