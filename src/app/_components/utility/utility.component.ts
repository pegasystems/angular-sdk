import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-utility',
  templateUrl: './utility.component.html',
  styleUrls: ['./utility.component.scss']
})
export class UtilityComponent implements OnInit {

  @Input() pConn$: any;

  configProps$: any;
  
  headerIcon$ : string;
  headerText$ : string;
  headerIconUrl$: string;
  noItemsMessage$ : string;

  PCore$: any;

  constructor() { }

  ngOnInit(): void {


    if (!this.PCore$) {
      this.PCore$ = window.PCore;
    }


    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());

    this.headerIcon$ = this.configProps$["headerIcon"];
    this.headerIconUrl$ = this.PCore$.getAssetLoader().getStaticServerUrl();
    this.headerText$ = this.configProps$["headerText"];
    this.noItemsMessage$ = this.configProps$["noItemsMessage"]; 

  }



}