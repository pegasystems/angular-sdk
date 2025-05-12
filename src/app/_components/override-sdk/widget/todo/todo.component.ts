import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { publicConstants } from '@pega/pcore-pconnect-typedefs/constants';
import { ProgressSpinnerService } from '@pega/angular-sdk-components';
import { ErrorMessagesService } from '@pega/angular-sdk-components';
import { Utils } from '@pega/angular-sdk-components';
import { MatCardModule } from '@angular/material/card';
import { updateWorkList } from '@pega/angular-sdk-components';

const fetchMyWorkList = (datapage, fields, numberOfRecords, includeTotalCount, context) => {
  return PCore.getDataPageUtils()
    .getDataAsync(
      datapage,
      context,
      {},
      {
        pageNumber: 1,
        pageSize: numberOfRecords
      },
      {
        select: Object.keys(fields).map(key => ({ field: PCore.getAnnotationUtils().getPropertyName(fields[key]) })),
        sortBy: [
          { field: 'pxUrgencyAssign', type: 'DESC' },
          { field: 'pxDeadlineTime', type: 'ASC' },
          { field: 'pxCreateDateTime', type: 'DESC' }
        ]
      },
      {
        invalidateCache: true,
        additionalApiParams: {
          includeTotalCount
        }
      }
    )
    .then(response => {
      return {
        ...response,
        data: (Array.isArray(response?.data) ? response.data : []).map(row =>
          Object.keys(fields).reduce((obj, key) => {
            obj[key] = row[PCore.getAnnotationUtils().getPropertyName(fields[key])];
            return obj;
          }, {})
        )
      };
    });
};

const getMappedValue = value => {
  const mappedValue = PCore.getEnvironmentInfo().getKeyMapping(value);
  return mappedValue === null ? value : mappedValue;
};

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
export class TodoComponent implements OnInit, OnDestroy {
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
  currentUser$: string | undefined;
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
  canPerform: boolean;
  count: number;

  constructor(
    private psService: ProgressSpinnerService,
    private erService: ErrorMessagesService,
    private utils: Utils
  ) {}

  ngOnInit() {
    this.CONSTS = PCore.getConstants();
    const { CREATE_STAGE_SAVED, CREATE_STAGE_DELETED } = PCore.getEvents().getCaseEvent();

    PCore.getPubSubUtils().subscribe(PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL, () => this.updateToDo(), 'updateToDo');
    PCore.getPubSubUtils().subscribe(CREATE_STAGE_SAVED, () => this.updateList(), CREATE_STAGE_SAVED);
    PCore.getPubSubUtils().subscribe(CREATE_STAGE_DELETED, () => this.updateList(), CREATE_STAGE_DELETED);

    this.updateToDo();
  }

  ngOnDestroy() {
    const { CREATE_STAGE_SAVED, CREATE_STAGE_DELETED } = PCore.getEvents().getCaseEvent();

    PCore.getPubSubUtils().unsubscribe(PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL, 'updateToDo');
    PCore.getPubSubUtils().unsubscribe(CREATE_STAGE_SAVED, CREATE_STAGE_SAVED);
    PCore.getPubSubUtils().unsubscribe(CREATE_STAGE_DELETED, CREATE_STAGE_DELETED);
  }

  updateList() {
    const {
      WORK_BASKET: {
        DATA_PAGES: { D__PY_MY_WORK_LIST }
      }
    } = PCore.getConstants();
    updateWorkList(getPConnect, getMappedValue(D__PY_MY_WORK_LIST));
  }

  updateToDo() {
    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps()) as ToDoProps;

    this.headerText$ = this.headerText$ || this.configProps$.headerText;

    this.datasource$ = this.datasource$ || this.configProps$.datasource;
    this.myWorkList$ = this.myWorkList$ || this.configProps$.myWorkList;

    this.assignmentsSource$ = this.datasource$?.source || this.myWorkList$?.source;

    if (this.showTodoList$) {
      if (this.assignmentsSource$) {
        this.count = this.assignmentsSource$ ? this.assignmentsSource$.length : 0;
        this.arAssignments$ = this.topThreeAssignments(this.assignmentsSource$);
      } else if (this.myWorkList$.datapage) {
        fetchMyWorkList(this.myWorkList$.datapage, this.pConn$.getComponentConfig()?.myWorkList.fields, 3, true, this.context$).then(responseData => {
          this.deferLoadWorklistItems(responseData);
        });
      } else {
        this.arAssignments$ = [];
      }
    } else {
      // get caseInfoId assignment.
      // eslint-disable-next-line no-lonely-if
      if (this.caseInfoID$ != undefined) {
        this.arAssignments$ = this.getCaseInfoAssignment(this.assignmentsSource$, this.caseInfoID$);
      }
    }

    this.canPerform = this.arAssignments$?.[0]?.canPerform === 'true' || this.arAssignments$?.[0]?.canPerform === true;

    this.currentUser$ = PCore.getEnvironmentInfo().getOperatorName();
    this.currentUserInitials$ = this.utils.getInitials(this.currentUser$ ?? '');
  }

  deferLoadWorklistItems(responseData) {
    this.count = responseData.totalCount;
    this.arAssignments$ = responseData.data;
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
    this.bShowMore$ = false;

    const { WORKLIST } = PCore.getConstants();

    if (this.type$ === WORKLIST && this.count && this.count > this.arAssignments$.length && !this.assignmentsSource$) {
      fetchMyWorkList(this.myWorkList$.datapage, this.pConn$.getComponentConfig()?.myWorkList.fields, this.count, false, this.context$).then(
        response => {
          this.arAssignments$ = response.data;
        }
      );
    } else {
      this.arAssignments$ = this.assignmentsSource$;
    }
  }

  _showLess() {
    this.bShowMore$ = true;
    const { WORKLIST } = PCore.getConstants();

    this.arAssignments$ = this.type$ === WORKLIST ? this.arAssignments$.slice(0, 3) : this.topThreeAssignments(this.assignmentsSource$);
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
