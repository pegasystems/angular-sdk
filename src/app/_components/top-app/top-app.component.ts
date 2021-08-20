import { Component, OnInit, Input } from '@angular/core';
import { ChangeDetectorRef } from "@angular/core";
import { interval } from "rxjs/internal/observable/interval";
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Subscribable, Subscription } from 'rxjs';
import { NgZone } from '@angular/core';


@Component({
  selector: 'app-top-app',
  templateUrl: './top-app.component.html',
  styleUrls: ['./top-app.component.scss']
})


export class TopAppComponent implements OnInit {

  sComponentName$: string;
  arChildren$: Array<any>;
  bPCoreReady$: boolean = false;

  pConn$: any;
  props$: any;
  PCore$: any;



  storeUnsubscribe : any;
  store: any;

  initReduxMessage: any;
  initReduxSubscription: Subscription;




  constructor(private cdRef: ChangeDetectorRef,
              private ngZone: NgZone) { 

  }

  ngOnInit() {
    
    this.doSubscribe();
  }
  
  doSubscribe() {


  
    window.PCore.onPCoreReady( (renderObj: any) => {
    
      // Change to reflect new use of arg in the callback:
      const { props /*, domContainerID = null */ } = renderObj;

      this.ngZone.run( () => {
        this.props$ = props;

        this.pConn$ = this.props$.getPConnect();
    
        this.sComponentName$ = this.pConn$.getComponentName();
  
        this.store = window.PCore.getStore();
        this.PCore$ = window.PCore;
  
        this.arChildren$ = this.pConn$.getChildren();
  
  
        this.bPCoreReady$ = true;

      });




      sessionStorage.setItem("pCoreUsage", "AngularSDK");

    } );


 }






}
