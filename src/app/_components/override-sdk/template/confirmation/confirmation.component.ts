import { Component, OnInit, Input, forwardRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { publicConstants } from '@pega/pcore-pconnect-typedefs/constants';
import { AngularPConnectData, AngularPConnectService } from '@pega/angular-sdk-components';
import { getToDoAssignments } from '@pega/angular-sdk-components';
import { ComponentMapperComponent } from '@pega/angular-sdk-components';

interface ConfirmationProps {
  // If any, enter additional props that only exist on this component
  datasource: { source: any };
  label: string;
  showLabel: boolean;
  showTasks: boolean;
}

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
  standalone: true,
  imports: [CommonModule, MatButtonModule, forwardRef(() => ComponentMapperComponent)]
})
export class ConfirmationComponent implements OnInit, OnDestroy {
  @Input() pConn$: typeof PConnect;

  angularPConnectData: AngularPConnectData = {};
  configProps$: ConfirmationProps;

  rootInfo: any;
  datasource: any;
  showTasks: any;
  detailProps: any;
  toDoList: any;
  label: string;
  CONSTS: typeof publicConstants;
  showDetails: boolean;
  showConfirmView = true;

  constructor(private angularPConnect: AngularPConnectService) {}

  ngOnInit(): void {
    // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);
    this.CONSTS = PCore.getConstants();
    const activeContainerItemID = PCore.getContainerUtils().getActiveContainerItemName(this.pConn$.getTarget() ?? null);
    this.rootInfo = PCore.getContainerUtils().getContainerItemData(this.pConn$.getTarget(), activeContainerItemID);
    this.checkAndUpdate();
  }

  ngOnDestroy() {
    if (this.angularPConnectData.unsubscribeFn) {
      this.angularPConnectData.unsubscribeFn();
    }
  }

  onStateChange() {
    this.checkAndUpdate();
  }

  checkAndUpdate() {
    // Should always check the bridge to see if the component should
    // update itself (re-render)
    const bUpdateSelf = this.angularPConnect.shouldComponentUpdate(this);

    // ONLY call updateSelf when the component should update
    if (bUpdateSelf) {
      this.updateSelf();
    }
  }

  updateSelf() {
    const theConfigProps = this.pConn$.getConfigProps() as ConfirmationProps;
    this.datasource = theConfigProps?.datasource;
    this.showTasks = theConfigProps?.showTasks;
    this.label = theConfigProps?.label;
    // Get the inherited props from the parent to determine label settings
    // Not using whatsNext at the moment, need to figure out the use of it
    // const whatsNext = this.datasource?.source;
    // const items = whatsNext?.length > 0 ? whatsNext.map((item) => item.label) : '';
    // const todoProps = { ...theConfigProps, renderTodoInConfirm: true };
    this.toDoList = getToDoAssignments(this.pConn$);
    this.detailProps = { ...theConfigProps, showLabel: false };
    this.showDetails = this.pConn$?.getChildren()?.[0]?.getPConnect()?.getChildren()?.length > 0;
  }

  onConfirmViewClose() {
    this.showConfirmView = false;
    PCore.getPubSubUtils().publish(PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.CLOSE_CONFIRM_VIEW, this.rootInfo);
    window.location.reload();
  }
}
