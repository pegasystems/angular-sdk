import { Component, OnInit, Input, NgZone, forwardRef, OnDestroy, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup } from '@angular/forms';
import { AngularPConnectData, AngularPConnectService } from '@pega/angular-sdk-components';
import { ErrorMessagesService } from '@pega/angular-sdk-components';
import { ProgressSpinnerService } from '@pega/angular-sdk-components';
import { ReferenceComponent } from '@pega/angular-sdk-components';
import { ComponentMapperComponent } from '@pega/angular-sdk-components';

interface AssignmentProps {
  // If any, enter additional props that only exist on this component
  template: string;
}

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.scss'],
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, forwardRef(() => ComponentMapperComponent)]
})
export class AssignmentComponent implements OnInit, OnDestroy, OnChanges {
  @Input() pConn$: typeof PConnect;
  @Input() formGroup$: FormGroup;
  @Input() arChildren$: any[];
  @Input() itemKey$: string;
  @Input() isCreateStage$: boolean;
  @Input() updateToken$: number;
  @Input() isInModal$ = false;
  @Input() banners;

  // For interaction with AngularPConnect
  angularPConnectData: AngularPConnectData = {};
  configProps$: AssignmentProps;

  newPConn$: any;
  containerName$: string;

  bInitialized = false;

  templateName$: string;

  arMainButtons$: any[];
  arSecondaryButtons$: any[];

  actionsAPI: any;

  bHasNavigation$ = false;
  bIsVertical$ = false;
  arCurrentStepIndicies$: number[] = [];
  arNavigationSteps$: any[] = [];

  init: boolean;
  finishAssignment: any;
  navigateToStep: any;
  saveAssignment: any;
  cancelAssignment: any;
  cancelCreateStageAssignment: any;
  showPage: any;
  approveCase: any;
  rejectCase: any;
  // itemKey: string = "";   // JA - this is what Nebula/Constellation uses to pass to finishAssignment, navigateToStep

  bReInit = false;
  localizedVal;
  localeCategory = 'Assignment';
  localeReference;

  constructor(
    private angularPConnect: AngularPConnectService,
    private psService: ProgressSpinnerService,
    private erService: ErrorMessagesService,
    private ngZone: NgZone,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);

    this.initComponent();

    this.angularPConnect.shouldComponentUpdate(this);

    this.bInitialized = true;
    this.localizedVal = PCore.getLocaleUtils().getLocaleValue;
    this.localeReference = `${this.pConn$.getCaseInfo().getClassName()}!CASE!${this.pConn$.getCaseInfo().getName()}`.toUpperCase();
  }

  ngOnDestroy() {
    if (this.angularPConnectData.unsubscribeFn) {
      this.angularPConnectData.unsubscribeFn();
    }
  }

  // Callback passed when subscribing to store change
  onStateChange() {
    this.checkAndUpdate();
  }

  checkAndUpdate() {
    // Should always check the bridge to see if the component should update itself (re-render)
    const bUpdateSelf = this.angularPConnect.shouldComponentUpdate(this);

    // ONLY call updateSelf when the component should update
    //    AND removing the "gate" that was put there since shouldComponentUpdate
    //      should be the real "gate"
    if (bUpdateSelf) {
      let loadingInfo;
      try {
        // loadingInfo = this.pConn$.getLoadingStatus();
        loadingInfo = this.newPConn$.getLoadingStatus();

        this.psService.sendMessage(loadingInfo);
      } catch (ex) {
        /* empty */
      }
    }
  }

  ngOnChanges() {
    if (this.bInitialized) {
      this.updateChanges();
    }
  }

  updateChanges() {
    // pConn$ may be a 'reference' component, so normalize it
    this.newPConn$ = ReferenceComponent.normalizePConn(this.pConn$);

    if (this.arChildren$) {
      this.createButtons();
    }
  }

  initComponent() {
    // pConn$ may be a 'reference' component, so normalize it
    // this.pConn$ = ReferenceComponent.normalizePConn(this.pConn$);
    this.newPConn$ = ReferenceComponent.normalizePConn(this.pConn$);

    // prevent re-intializing with flowContainer update unless an action is taken
    this.bReInit = false;
    this.bHasNavigation$ = false;

    // this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());
    this.configProps$ = this.newPConn$.resolveConfigProps(this.newPConn$.getConfigProps());

    this.templateName$ = this.configProps$.template;

    // create pointers to functions
    /*
    let containerMgr = this.pConn$.getContainerManager();
    let actionsAPI = this.pConn$.getActionsApi();
    let baseContext = this.pConn$.getContextName();
    let acName = this.pConn$.getContainerName();
    */

    const actionsAPI = this.newPConn$.getActionsApi();
    const baseContext = this.newPConn$.getContextName();
    const acName = this.newPConn$.getContainerName();

    // for now, in general this should be overridden by updateSelf(), and not be blank
    if (this.itemKey$ === '') {
      this.itemKey$ = baseContext.concat('/').concat(acName);
    }

    // this.pConn$.isBoundToState();
    this.newPConn$.isBoundToState();

    this.init = false;

    // store off bound functions to above pointers
    this.finishAssignment = actionsAPI.finishAssignment.bind(actionsAPI);
    this.navigateToStep = actionsAPI.navigateToStep.bind(actionsAPI);
    this.saveAssignment = actionsAPI.saveAssignment.bind(actionsAPI);
    this.cancelAssignment = actionsAPI.cancelAssignment.bind(actionsAPI);
    this.showPage = actionsAPI.showPage.bind(actionsAPI);

    this.cancelCreateStageAssignment = actionsAPI.cancelCreateStageAssignment.bind(actionsAPI);
    this.approveCase = actionsAPI.approveCase?.bind(actionsAPI);
    this.rejectCase = actionsAPI.rejectCase?.bind(actionsAPI);

    if (this.arChildren$) {
      this.createButtons();
    }
  }

  createButtons() {
    // let oData = this.pConn$.getDataObject();
    const oData = this.newPConn$.getDataObject();

    // inside
    // get fist kid, get the name and displa
    // pass first kid to a view container, which will disperse it to a view which will use one column, two column, etc.
    const oWorkItem = this.arChildren$[0].getPConnect();
    const oWorkData = oWorkItem.getDataObject();

    if (oWorkData) {
      this.actionsAPI = oWorkItem.getActionsApi();

      // this.containerName$ = oWorkMeta["name"];

      if (oWorkData.caseInfo && oWorkData.caseInfo.assignments !== null) {
        this.containerName$ = oWorkData.caseInfo.assignments?.[0].name;

        // get caseInfo
        const oCaseInfo = oData.caseInfo;

        if (oCaseInfo && oCaseInfo.actionButtons) {
          this.arMainButtons$ = oCaseInfo.actionButtons.main;
          this.arSecondaryButtons$ = oCaseInfo.actionButtons.secondary;
        }

        if (oCaseInfo.navigation != null) {
          this.createButtonsForMultiStepForm(oCaseInfo);
        } else {
          this.bHasNavigation$ = false;
        }
      }
    }
  }

  createButtonsForMultiStepForm(oCaseInfo) {
    this.bHasNavigation$ = true;

    if ((oCaseInfo.navigation.template && oCaseInfo.navigation.template.toLowerCase() === 'standard') || oCaseInfo?.navigation?.steps?.length === 1) {
      this.bHasNavigation$ = false;
    } else if (oCaseInfo.navigation.template && oCaseInfo.navigation.template.toLowerCase() === 'vertical') {
      this.bIsVertical$ = true;
    } else {
      this.bIsVertical$ = false;
    }

    // iterate through steps to find current one(s)
    // immutable, so we want to change the local copy, so need to make a copy
    this.ngZone.run(() => {
      // what comes back now in configObject is the children of the flowContainer
      this.arNavigationSteps$ = JSON.parse(JSON.stringify(oCaseInfo.navigation.steps));
      this.arNavigationSteps$.forEach(step => {
        if (step.name) {
          step.name = PCore.getLocaleUtils().getLocaleValue(step.name, undefined, this.localeReference);
        }
      });
      this.arCurrentStepIndicies$ = [];
      this.arCurrentStepIndicies$ = this.findCurrentIndicies(this.arNavigationSteps$, this.arCurrentStepIndicies$, 0);
    });
  }

  findCurrentIndicies(arStepperSteps: any[], arIndicies: number[], depth: number): number[] {
    let count = 0;
    arStepperSteps.forEach(step => {
      if (step.visited_status == 'current') {
        arIndicies[depth] = count;

        // add in
        step.step_status = '';
      } else if (step.visited_status == 'success') {
        count++;
        step.step_status = 'completed';
      } else {
        count++;
        step.step_status = '';
      }

      if (step.steps) {
        arIndicies = this.findCurrentIndicies(step.steps, arIndicies, depth + 1);
      }
    });

    return arIndicies;
  }

  onSaveActionSuccess(data) {
    this.actionsAPI.cancelAssignment(this.itemKey$).then(() => {
      this.psService.sendMessage(false);
      PCore.getPubSubUtils().publish(PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.CREATE_STAGE_SAVED, data);
    });
  }

  onActionButtonClick(oData: any) {
    this.buttonClick(oData.action, oData.buttonType);
  }

  buttonClick(sAction, sButtonType) {
    // right now, done on an individual basis, setting bReInit to true
    // upon the next flow container state change, will cause the flow container
    // to re-initialize
    // this.bReInit =true;

    /*
    let baseContext = this.pConn$.getContextName();
    let acName = this.pConn$.getContainerName();
    let itemID = baseContext.concat("/").concat(acName);
    */

    // const baseContext = this.newPConn$.getContextName();
    // const acName = this.newPConn$.getContainerName();
    // const itemID = baseContext.concat('/').concat(acName);

    if (sButtonType == 'secondary') {
      // const stepID = ''; // ???

      // need to handle cancel as this.cancel(dispatchInfo)
      // this.actionsAPI[sAction](dispatchInfo);
      switch (sAction) {
        case 'navigateToStep':
          this.erService.sendMessage('publish', '');
          if (this.formValid()) {
            this.bReInit = true;
            this.psService.sendMessage(true);

            const navigatePromise = this.navigateToStep('previous', this.itemKey$);
            navigatePromise
              .then(() => {
                this.updateChanges();
                this.psService.sendMessage(false);
              })
              .catch(() => {
                this.psService.sendMessage(false);
                this.snackBar.open(`${this.localizedVal('Navigation failed!', this.localeCategory)}`, 'Ok');
              });
          }
          break;

        case 'saveAssignment': {
          const caseID = this.pConn$.getCaseInfo().getKey();
          const assignmentID = this.pConn$.getCaseInfo().getAssignmentID();
          const savePromise = this.saveAssignment(this.itemKey$);

          savePromise
            .then(() => {
              const caseType = this.pConn$.getCaseInfo().c11nEnv.getValue(PCore.getConstants().CASE_INFO.CASE_TYPE_ID);
              PCore.getPubSubUtils().publish('cancelPressed');
              this.onSaveActionSuccess({ caseType, caseID, assignmentID });
            })
            .catch(() => {
              this.psService.sendMessage(false);
              this.snackBar.open(`${this.localizedVal('Save failed', this.localeCategory)}`, 'Ok');
            });

          break;
        }

        case 'cancelAssignment':
          window.location.reload();
          // this.bReInit = true;
          // this.erService.sendMessage('dismiss', '');
          // // @ts-ignore - Property 'isAssignmentInCreateStage' is private and only accessible within class 'CaseInfo'
          // const isAssignmentInCreateStage = this.pConn$.getCaseInfo().isAssignmentInCreateStage();
          // const isLocalAction =
          //   // @ts-ignore - Property 'isLocalAction' is private and only accessible within class 'CaseInfo'.
          //   this.pConn$.getCaseInfo().isLocalAction() ||
          //   // @ts-ignore - second parameter pageReference for getValue method should be optional
          //   (PCore.getConstants().CASE_INFO.IS_LOCAL_ACTION && this.pConn$.getValue(PCore.getConstants().CASE_INFO.IS_LOCAL_ACTION));
          // // check if create stage (modal)
          // if (isAssignmentInCreateStage && this.isInModal$ && !isLocalAction) {
          //   const cancelPromise = this.cancelCreateStageAssignment(this.itemKey$);
          //   cancelPromise
          //     .then(() => {
          //       this.psService.sendMessage(false);
          //       // PCore.getPubSubUtils().publish(
          //       //   PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL);
          //     })
          //     .catch(() => {
          //       this.psService.sendMessage(false);
          //       this.snackBar.open(`${this.localizedVal('Cancel failed!', this.localeCategory)}`, 'Ok');
          //     });
          // } else {
          //   this.psService.sendMessage(true);

          //   // publish before cancel pressed, because
          //   // cancel assignment happens "after" cancel assignment happens
          //   // @ts-ignore - second parameter “payload” for publish method should be optional
          //   PCore.getPubSubUtils().publish('cancelPressed');

          //   const cancelPromise = this.cancelAssignment(this.itemKey$);
          //   cancelPromise
          //     .then(() => {
          //       this.psService.sendMessage(false);
          //       // @ts-ignore - second parameter “payload” for publish method should be optional
          //       PCore.getPubSubUtils().publish(PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL);
          //     })
          //     .catch(() => {
          //       this.psService.sendMessage(false);
          //       this.snackBar.open(`${this.localizedVal('Cancel failed!', this.localeCategory)}`, 'Ok');
          //     });
          // }
          break;

        case 'rejectCase': {
          const rejectPromise = this.rejectCase(this.itemKey$);

          rejectPromise
            .then(() => {})
            .catch(() => {
              this.psService.sendMessage(false);
              this.snackBar.open(`${this.localizedVal('Rejection failed!', this.localeCategory)}`, 'Ok');
            });

          break;
        }

        default:
          break;
      }
    } else if (sButtonType == 'primary') {
      switch (sAction) {
        case 'finishAssignment':
          this.erService.sendMessage('publish', '');
          if (this.formValid()) {
            this.bReInit = true;
            this.psService.sendMessage(true);
            const finishPromise = this.finishAssignment(this.itemKey$); // JA - was itemID but Nebula/Constellation uses itemKey
            finishPromise
              .then(() => {
                this.psService.sendMessage(false);
                this.updateChanges();
              })
              .catch(() => {
                this.psService.sendMessage(false);
                this.snackBar.open(`${this.localizedVal('Submit failed!', this.localeCategory)}`, 'Ok');
              });
          } else {
            // let snackBarRef = this.snackBar.open("Please fix errors on form.",  "Ok");
            this.erService.sendMessage('show', this.localizedVal('Please fix errors on form.', this.localeCategory));
          }
          break;
        case 'approveCase': {
          const approvePromise = this.approveCase(this.itemKey$);

          approvePromise
            .then(() => {})
            .catch(() => {
              this.psService.sendMessage(false);
              this.snackBar.open(`${this.localizedVal('Approve failed!', this.localeCategory)}`, 'Ok');
            });

          break;
        }
        default:
          break;
      }
    }
  }

  formValid(): boolean {
    this.touchAll();
    return this.formGroup$.valid;
  }

  touchAll(): void {
    Object.values(this.formGroup$.controls).forEach((control: any) => {
      control.markAsTouched();
    });
  }

  topViewRefresh(): void {
    Object.values(this.formGroup$.controls).forEach((control: any) => {
      control.markAsTouched();
    });
  }
}
