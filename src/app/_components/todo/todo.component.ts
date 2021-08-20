import { Component, OnInit, Input } from '@angular/core';
import { ProgressSpinnerService } from "../../_messages/progress-spinner.service";
import { Utils } from "../../_helpers/utils";
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
  providers: [Utils]
})
export class TodoComponent implements OnInit {

  @Input() pConn$: any;
  @Input() caseInfoID$: string;
  @Input() datasource$: any;
  @Input() headerText$: string;
  @Input() itemKey$: string;
  @Input() showTodoList$: boolean = true;
  @Input() target$: string;
  @Input() type$: string = "worklist";
  @Input() context$: string;


  configProps$ : Object;
  currentUser$ : string;
  currentUserInitials$: string = "--";

  currentClassName: string = "";

  assignmentCount$: number;

  bShowMore$: boolean = true;



  arAssignments$: Array<any>;

  PCore$: any;

  constructor(private psService: ProgressSpinnerService,
              private ngZone: NgZone,
              private utils: Utils) { }

  ngOnInit() {

    if (!this.PCore$) {
      this.PCore$ = window.PCore;
    }

    const {
      CREATE_STAGE_SAVED,
      CREATE_STAGE_DELETED
    } = this.PCore$.getEvents().getCaseEvent();

    this.PCore$.getPubSubUtils().subscribe(
      this.PCore$.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL,
      () => { this.updateToDo() },
      "updateToDo"
    );

    this.PCore$.getPubSubUtils().subscribe(
      CREATE_STAGE_SAVED,
      () => { this.updateList() },
      CREATE_STAGE_SAVED
    );

    this.PCore$.getPubSubUtils().subscribe(
      CREATE_STAGE_DELETED,
      () => { this.updateList() },
      CREATE_STAGE_DELETED
    );
  
    this.updateToDo();

  }

  ngOnDestroy() {

    const {
      CREATE_STAGE_SAVED,
      CREATE_STAGE_DELETED
    } = this.PCore$.getEvents().getCaseEvent();

    this.PCore$.getPubSubUtils().unsubscribe(
      this.PCore$.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL,
      "updateToDo"
    );

    this.PCore$.getPubSubUtils().unsubscribe(
      CREATE_STAGE_SAVED,
      CREATE_STAGE_SAVED
    );

    this.PCore$.getPubSubUtils().unsubscribe(
      CREATE_STAGE_DELETED,
      CREATE_STAGE_DELETED
    );

  }

  ngOnChanges(data: any) {


    // don't update until we'va had an init
    if (this.PCore$) {
      this.updateToDo();
    }

  }



  updateWorkList(key) {
    this.PCore$.getDataApiUtils()
      .getData(key)
      .then((responseData) => {
        const dataObject = {};
        dataObject[key] = {
          pxResults: responseData.data.data
        };
  
        this.pConn$.updateState(dataObject);
        this.updateToDo();
      })
      .catch((err) => {
        console.error(err?.stack);
      });
  }

  updateList() {
    this.updateWorkList("D_pyMyWorkList");
  }

  updateToDo() {
    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());


    if (this.headerText$ == undefined) {
      this.headerText$ = this.configProps$["headerText"];
    }


    this.datasource$ = this.configProps$["datasource"] ? this.configProps$["datasource"] : this.datasource$;



    if (this.showTodoList$) {
      this.assignmentCount$ = (this.datasource$.source != null) ? this.datasource$.source.length : 0;
      this.arAssignments$ = this.topThreeAssignments(this.datasource$.source);
    }
    else {
      // get caseInfoId assignment.
      if (this.caseInfoID$ != undefined) {
        this.arAssignments$ = this.getCaseInfoAssignment(this.datasource$.source, this.caseInfoID$);
      }

    }
    

    this.currentUser$ = this.PCore$.getEnvironmentInfo().getOperatorName();
    this.currentUserInitials$ = this.utils.getInitials(this.currentUser$);
  }

  getID(assignment: any) {
    let sID = "";
    if (assignment.value) {
      let refKey = assignment.value;
      sID = refKey.substring(refKey.lastIndexOf(" ") + 1);
    }
    else {
      let refKey = assignment.ID;
      let arKeys = refKey.split("!")[0].split(" ");

      sID = arKeys[2];
    }

    return sID;

  }

  topThreeAssignments(arList: Array<any>) {
    let arList3: Array<any> = new Array<any>();

    if (arList && typeof(arList) == "object") {
      let len = arList.length;
      if (len > 3) len = 3;
  
      for (let i =0; i < len; i++) {
        arList3.push(arList[i]);
      }
    }


    return arList3;
  }

  getCaseInfoAssignment(arList: Array<any>, caseInfoID: string) {
    let arList1: Array<any> = new Array<any>();
    for ( var aIndex in arList) {
      if (arList[aIndex].ID.indexOf(caseInfoID) >= 0) {

        let listRow = JSON.parse(JSON.stringify(arList[aIndex]));

        // urgency becomes priority
        if (listRow.urgency) {
          listRow["priority"] = listRow.urgency;
        }

        if (listRow.ID) {
          // mimic regular list
          listRow["id"] = listRow["ID"];
        }
        
        arList1.push(listRow);
        break;
      }
    }

    return arList1;
  }

  _showMore() {
   

    this.ngZone.run( () => {
      this.bShowMore$ = false;
      this.arAssignments$ = this.datasource$.source;
    });

   
  }

  _showLess() {

    this.ngZone.run(() => {
      this.bShowMore$ = true;

      this.arAssignments$ = this.topThreeAssignments(this.datasource$.source);
    });

  }

  clickGo(assignment: any) {
    let { id, classname } = assignment[0];

    // capture className, as seem to loose it when 
    if (classname == null || classname == "") {
      classname = this.pConn$.getCaseInfo().getClassName();
    }

    let sTarget = this.pConn$.getContainerName();
    let sTargetContainerName = sTarget;
    let sIsActionFromTodoList = "todo";

    let options = { "containerName" : sTarget};

    if (classname == null || classname == "") {
      classname = this.pConn$.getCaseInfo().getClassName();
    }

    if (sTarget === "workarea") {
      options["isActionFromToDoList"] = true;
      options["target"] = "";
    }
    else {
      options["isActionFromToDoList"] = false;
      options["target"] = sTarget;
      options["context"] = "";
    }

    this.psService.sendMessage(true);

    this.pConn$.getActionsApi().openAssignment(id, classname, options).then(() => {});

  }

}
