// portal.service.ts
import { Injectable } from '@angular/core';
import { TemplatePortal } from '@angular/cdk/portal';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoPortalService {
  private portalSource = new BehaviorSubject<TemplatePortal<any> | null>(null);

  /**
   * An observable that components can subscribe to, to get the portal.
   */
  public portal$: Observable<TemplatePortal<any> | null> = this.portalSource.asObservable();

  /**
   * Sets the portal that should be rendered elsewhere.
   * @param portal The TemplatePortal to be shared.
   */
  setPortal(portal: TemplatePortal<any>) {
    this.portalSource.next(portal);
  }
}
