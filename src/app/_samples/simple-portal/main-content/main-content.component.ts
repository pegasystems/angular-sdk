import { Component, OnInit, Input, APP_BOOTSTRAP_LISTENER } from '@angular/core';



@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {

  @Input() pConn$: any;
  @Input() PCore$: any;
  @Input() props$: any;
  
  sComponentName$: string;
  arChildren$: Array<any>;
  bPCoreReady$: boolean = false;




  storeUnsubscribe : any;
  store: any;

  constructor() { 



  }

  ngOnInit(): void {


    if (this.pConn$) {
      this.sComponentName$ = this.pConn$.getComponentName();

    }

  }

}
