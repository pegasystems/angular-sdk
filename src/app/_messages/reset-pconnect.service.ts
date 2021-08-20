import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResetPConnectService {

  private subject = new Subject<any>();
 
  // sending 
  //  bReset - true: reset pconnect, false - do nothing
  //  sType - what causing the reset, so far (cancel, finishAssignment)
  //
  sendMessage(bReset: boolean, sType: string) {
      this.subject.next({ reset: bReset, type: sType});
  }

  clearMessage() {
      this.subject.next();
  }

  getMessage(): Observable<any> {
      return this.subject.asObservable();
  }
}
