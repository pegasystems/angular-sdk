import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ErrorMessagesService {

  private subject = new Subject<any>();

  constructor() { }

  // action - show, dismiss
  // actionMessage - text to displayed, will be queued with others until dismiss
  sendMessage(sAction : string, sActionMessage: string) {
      this.subject.next({ action: sAction, actionMessage: sActionMessage});
  }

  clearMessage() {
      this.subject.next();
  }

  getMessage(): Observable<any> {
      return this.subject.asObservable();
  }
}
