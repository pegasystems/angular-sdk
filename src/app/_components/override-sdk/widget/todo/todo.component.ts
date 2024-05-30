import { Component, OnInit, Input, NgZone, OnDestroy, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { publicConstants } from '@pega/pcore-pconnect-typedefs/constants';
import { ProgressSpinnerService } from '@pega/angular-sdk-components';
import { ErrorMessagesService } from '@pega/angular-sdk-components';
import { Utils } from '@pega/angular-sdk-components';
import { MatCardModule } from '@angular/material/card';

interface ToDoProps {
  // If any, enter additional props that only exist on this component
  datasource?: any;
  headerText?: string;
  myWorkList?: any;
  label?: string;
  readOnly?: boolean;
}

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
  providers: [Utils],
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule]
})
export class TodoComponent implements OnInit, OnDestroy, OnChanges {
  @Input() pConn$: typeof PConnect;
  @Input() caseInfoID$: string;
  @Input() datasource$: any;
  @Input() headerText$?: string;
  @Input() showTodoList$ = true;
  @Input() target$: string;
  @Input() type$ = 'worklist';
  @Input() context$: string;
  @Input() myWorkList$: any;
  @Input() isConfirm;

  configProps$: ToDoProps;
  currentUser$: string;
  currentUserInitials$ = '--';
  assignmentCount$: number;
  bShowMore$ = true;
  arAssignments$: any[];
  assignmentsSource$: any;
  CONSTS: typeof publicConstants;
  bLogging = true;
  localizedVal = PCore.getLocaleUtils().getLocaleValue;
  localeCategory = 'Todo';
  showlessLocalizedValue = this.localizedVal('show_less', 'CosmosFields');
  showMoreLocalizedValue = this.localizedVal('show_more', 'CosmosFields');

  constructor(
    private psService: ProgressSpinnerService,
    private erService: ErrorMessagesService,
    private ngZone: NgZone,
    private utils: Utils
  ) {}

  ngOnInit() {
    this.CONSTS = PCore.getConstants();
    const { CREATE_STAGE_SAVED, CREATE_STAGE_DELETED }: any = PCore.getEvents().getCaseEvent();

    PCore.getPubSubUtils().subscribe(
      PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL,
      () => {
        this.updateToDo();
      },
      'updateToDo'
    );

    PCore.getPubSubUtils().subscribe(
      CREATE_STAGE_SAVED,
      () => {
        this.updateList();
      },
      CREATE_STAGE_SAVED
    );

    PCore.getPubSubUtils().subscribe(
      CREATE_STAGE_DELETED,
      () => {
        this.updateList();
      },
      CREATE_STAGE_DELETED
    );

    this.updateToDo();
  }

  ngOnDestroy() {
    const { CREATE_STAGE_SAVED, CREATE_STAGE_DELETED }: any = PCore.getEvents().getCaseEvent();

    PCore.getPubSubUtils().unsubscribe(PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL, 'updateToDo');

    PCore.getPubSubUtils().unsubscribe(CREATE_STAGE_SAVED, CREATE_STAGE_SAVED);

    PCore.getPubSubUtils().unsubscribe(CREATE_STAGE_DELETED, CREATE_STAGE_DELETED);
  }

  ngOnChanges() {
    // don't update until we'va had an init
    if (PCore) {
      this.updateToDo();
    }
  }

  updateWorkList(key) {
    (
      PCore.getDataApiUtils()
        // @ts-ignore - 2nd parameter "payload" and 3rd parameter "context" should be optional in getData method
        .getData(key) as Promise<any>
    )
      .then(responseData => {
        const dataObject = {};
        dataObject[key] = {
          pxResults: responseData.data.data
        };

        this.pConn$.updateState(dataObject);
        this.updateToDo();
      })
      .catch(err => {
        console.error(err?.stack);
      });
  }

  updateList() {
    this.updateWorkList('D_pyMyWorkList');
  }

  updateToDo() {
    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps()) as ToDoProps;

    if (this.headerText$ == undefined) {
      this.headerText$ = this.configProps$.headerText;
    }

    this.datasource$ = this.configProps$.datasource ? this.configProps$.datasource : this.datasource$;
    this.myWorkList$ = this.configProps$.myWorkList ? this.configProps$.myWorkList : this.myWorkList$;

    this.assignmentsSource$ = this.datasource$?.source || this.myWorkList$?.source;

    if (this.showTodoList$) {
      this.assignmentCount$ = this.assignmentsSource$ != null ? this.assignmentsSource$.length : 0;
      this.arAssignments$ = this.topThreeAssignments(this.assignmentsSource$);
    } else {
      // get caseInfoId assignment.
      // eslint-disable-next-line no-lonely-if
      if (this.caseInfoID$ != undefined) {
        this.arAssignments$ = this.getCaseInfoAssignment(this.assignmentsSource$, this.caseInfoID$);
      }
    }

    this.currentUser$ = PCore.getEnvironmentInfo().getOperatorName();
    this.currentUserInitials$ = this.utils.getInitials(this.currentUser$);
  }

  getID(assignment: any) {
    if (assignment.value) {
      const refKey = assignment.value;
      return refKey.substring(refKey.lastIndexOf(' ') + 1);
    }
    const refKey = assignment.ID;
    const arKeys = refKey.split('!')[0].split(' ');
    return arKeys[2];
  }

  topThreeAssignments(assignmentsSource: any[]): any[] {
    return Array.isArray(assignmentsSource) ? assignmentsSource.slice(0, 3) : [];
  }

  getAssignmentId(assignment) {
    return this.type$ === this.CONSTS.TODO ? assignment.ID : assignment.id;
  }

  getPriority(assignment) {
    return this.type$ === this.CONSTS.TODO ? assignment.urgency : assignment.priority;
  }

  getAssignmentName(assignment) {
    return this.type$ === this.CONSTS.TODO ? assignment.name : assignment.stepName;
  }

  initAssignments(): any[] {
    if (this.assignmentsSource$) {
      this.assignmentCount$ = this.assignmentsSource$.length;
      return this.topThreeAssignments(this.assignmentsSource$);
    }
    // turn off todolist
    return [];
  }

  getCaseInfoAssignment(assignmentsSource: any[], caseInfoID: string) {
    const result: any[] = [];
    for (const source of assignmentsSource) {
      if (source.ID.indexOf(caseInfoID) >= 0) {
        const listRow = JSON.parse(JSON.stringify(source));
        // urgency becomes priority
        listRow.priority = listRow.urgency || undefined;
        // mimic regular list
        listRow.id = listRow.ID || undefined;
        result.push(listRow);
      }
    }
    return result;
  }

  _showMore() {
    this.ngZone.run(() => {
      this.bShowMore$ = false;
      this.arAssignments$ = this.assignmentsSource$;
    });
  }

  _showLess() {
    this.ngZone.run(() => {
      this.bShowMore$ = true;

      this.arAssignments$ = this.topThreeAssignments(this.assignmentsSource$);
    });
  }

  isChildCase(assignment) {
    return assignment.isChild;
  }

  clickGo(assignment) {
    const id = this.getAssignmentId(assignment);
    let { classname = '' } = assignment;
    const sTarget = this.pConn$.getContainerName();
    const sTargetContainerName = sTarget;

    const options: any = { containerName: sTargetContainerName, pageName: 'pyEmbedAssignment' };

    if (classname === null || classname === '') {
      classname = this.pConn$.getCaseInfo().getClassName();
    }

    if (sTarget === 'workarea') {
      options.isActionFromToDoList = true;
      options.target = '';
      options.context = null;
      options.isChild = this.isChildCase(assignment);
    } else {
      options.isActionFromToDoList = false;
      options.target = sTarget;
    }
    // options.pageName: 'pyEmbedAssignment'
    // const options: any = {
    //   pageName: 'pyEmbedAssignment'
    // };
    this.psService.sendMessage(true);
    // this.pConn$
    PCore.getMashupApi()
      .openAssignment(id, this.pConn$.getContextName(), options)
      .then(() => {
        console.log('openAssignment rendering is complete');
      })
      .catch(() => {
        this.psService.sendMessage(false);
        this.erService.sendMessage('show', 'Failed to open');
      });
    // this.pConn$
    //   .getActionsApi()
    //   .openAssignment(id, classname, options)
    //   .then(() => {
    //     this.psService.sendMessage(false);
    //     if (this.bLogging) {
    //       console.log(`openAssignment completed`);
    //     }
    //   })
    //   .catch(() => {
    //     this.psService.sendMessage(false);
    //     this.erService.sendMessage('show', 'Failed to open');
    //   });
  }
}
