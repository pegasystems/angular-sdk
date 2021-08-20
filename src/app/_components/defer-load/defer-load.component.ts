import { Component, OnInit, InputDecorator, Input } from '@angular/core';
import { ChangeDetectorRef } from "@angular/core";
import { ProgressSpinnerService } from "../../_messages/progress-spinner.service";

//
// WARNING:  It is not expected that this file should be modified.  It is part of infrastructure code that works with 
// Redux and creation/update of Redux containers and PConnect.  Modifying this code could have undesireable results and
// is totally at your own risk.
//

@Component({
  selector: 'app-defer-load',
  templateUrl: './defer-load.component.html',
  styleUrls: ['./defer-load.component.scss']
})
export class DeferLoadComponent implements OnInit {

  @Input() pConn$: any;
  @Input() loadData$: any;



  componentName$: string;
  loadedPConn$: any;

  bShowDefer$: boolean = false;

  PCore$: any;

  constructor(private cdRef: ChangeDetectorRef,
              private psService: ProgressSpinnerService) { }

  ngOnInit(): void {

    if (!this.PCore$) {
      this.PCore$ = window.PCore;
    }

    this.PCore$.getPubSubUtils().subscribe(
      this.PCore$.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL,
      (data) => { this.loadActiveTab(data) },
      "loadActiveTab"
    );

    this.PCore$.getPubSubUtils().subscribe(
      this.PCore$.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.ASSIGNMENT_SUBMISSION,
      (data) => { this.loadActiveTab(data) },
      "loadActiveTab"
    );
  }

  ngOnDestroy(): void {

    this.PCore$.getPubSubUtils().unsubscribe(
      this.PCore$.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL,
      "loadActiveTab"
    );

    this.PCore$.getPubSubUtils().unsubscribe(
      this.PCore$.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.ASSIGNMENT_SUBMISSION,
      "loadActiveTab"
    );
  }

  ngOnChanges() {
    if (!this.PCore$) {
      this.PCore$ = window.PCore;
    }
    
    this.loadActiveTab();
  }

  loadActiveTab(data: any = {}) {

    const { isModalAction } = data;

    if (this.loadData$ && this.loadData$["config"] && !isModalAction) {

      let name = this.loadData$.config.name;
      let actionsAPI = this.pConn$.getActionsApi();
      let baseContext = this.pConn$.getContextName();
      let basePageReference = this.pConn$.getPageReference();
      let loadView = actionsAPI.loadView.bind(actionsAPI);

      this.bShowDefer$ = false;

      // Latest version in Nebula/Constellation uses value for CASE_INFO.CASE_INFO_ID is it exists
      //  and prefers that over PZINSKEY
      loadView(encodeURI(
        this.pConn$.getValue( this.PCore$.getConstants().CASE_INFO.CASE_INFO_ID ) ||
        this.pConn$.getValue( this.PCore$.getConstants().PZINSKEY)
        ), name)
        .then((data) => {
          const config = {
            meta: data,
            options: {
              context: baseContext,
              pageReference: basePageReference
            }
          };

        
          let configObject = this.PCore$.createPConnect(config);

          this.bShowDefer$ = true;


          if (this.loadData$.config.label == "Details") {
            // for now, prevent details from being drawn
            this.componentName$ = "Details";

            this.loadedPConn$ = configObject.getPConnect();
            this.componentName$ = this.loadedPConn$.getComponentName();  
    
          }
          else {
            this.loadedPConn$ = configObject.getPConnect();
            this.componentName$ = this.loadedPConn$.getComponentName();         
          }
          

          this.psService.sendMessage(false);
          this.cdRef.detectChanges();
        });

      }


  }
  

}
