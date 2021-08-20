import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateWorklistService {

  private subject = new Subject<any>();

  // sending 
  //  bUpdate - true: update worklist, false - do nothing
  //
  sendMessage(bUpdate: boolean) {
    this.subject.next({ update: bUpdate});
  }

  clearMessage() {
    this.subject.next();
  }

  getMessage(): Observable<any> {
      return this.subject.asObservable();
  }


}
