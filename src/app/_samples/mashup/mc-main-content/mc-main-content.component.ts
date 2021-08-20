import { Component, OnInit, Input, APP_BOOTSTRAP_LISTENER } from '@angular/core';



@Component({
  selector: 'app-mc-main-content',
  templateUrl: './mc-main-content.component.html',
  styleUrls: ['./mc-main-content.component.scss']
})
export class MCMainContentComponent implements OnInit {

  @Input() pConn$: any;
  
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
