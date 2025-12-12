import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  // Create a writable signal with an initial value of false
  private isCollapsedSignal = signal(false);

  // Expose a readonly version of the signal to prevent outside modification
  public readonly isCollapsed = this.isCollapsedSignal.asReadonly();

  constructor() {}

  toggleCollapse() {
    // 'update' is the safe way to compute a new value from the previous one
    this.isCollapsedSignal.update(value => !value);
  }
}
