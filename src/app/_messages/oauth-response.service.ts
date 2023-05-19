import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OAuthResponseService {
  private subject = new Subject<any>();

  constructor() {}

  /**
   * Function to pass the OAuth token
   * @param oToken - token
   */
  sendMessage(oToken: any) {
    this.subject.next({ token: oToken });
  }

  clearMessage() {
    this.subject.next();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
