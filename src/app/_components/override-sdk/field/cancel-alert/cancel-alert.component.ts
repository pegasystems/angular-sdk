import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { ProgressSpinnerService } from '@pega/angular-sdk-components';

@Component({
  selector: 'app-cancel-alert',
  templateUrl: './cancel-alert.component.html',
  styleUrls: ['./cancel-alert.component.scss'],
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatButtonModule]
})
export class CancelAlertComponent implements OnChanges {
  @Input() pConn$: typeof PConnect;
  @Input() bShowAlert$: boolean;
  @Output() onAlertState$: EventEmitter<boolean> = new EventEmitter<boolean>();

  heading$: string;
  body1$: string;
  body2$: string;
  itemKey: string;
  localizedVal: Function;
  localeCategory = 'ModalContainer';

  constructor(private psService: ProgressSpinnerService) {}
  ngOnChanges() {
    if (this.bShowAlert$) {
      this.psService.sendMessage(false);

      const contextName = this.pConn$.getContextName();
      const caseInfo = this.pConn$.getCaseInfo();
      const caseName = caseInfo.getName();
      const ID = caseInfo.getID();
      this.localizedVal = PCore.getLocaleUtils().getLocaleValue;

      this.itemKey = contextName;
      this.heading$ = `Delete ${caseName} (${ID})`;
      this.body1$ = `${this.localizedVal('Are you sure you want to delete ', this.localeCategory) + caseName} (${ID})?`;
      this.body2$ = this.localizedVal('Alternatively, you can continue working or save your work for later.', this.localeCategory);

      // this.onAlertState$.emit(true);
    }
  }

  dismissAlert() {
    this.bShowAlert$ = false;
    this.onAlertState$.emit(false);
  }

  dismissAlertOnly() {
    this.bShowAlert$ = false;
    this.onAlertState$.emit(true);
  }

  sendMessage(sMessage: string) {
    alert(sMessage);
  }

  buttonClick(sAction) {
    const actionsAPI = this.pConn$.getActionsApi();
    this.localizedVal = PCore.getLocaleUtils().getLocaleValue;

    switch (sAction) {
      case 'save':
        this.psService.sendMessage(true);
        // eslint-disable-next-line no-case-declarations
        const savePromise = actionsAPI.saveAndClose(this.itemKey);
        savePromise
          .then(() => {
            this.psService.sendMessage(false);
            this.dismissAlert();

            PCore.getPubSubUtils().publish(PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.CASE_CREATED);
          })
          .catch(() => {
            this.psService.sendMessage(false);
            this.sendMessage(this.localizedVal('Save failed', this.localeCategory));
          });
        break;
      case 'continue':
        this.dismissAlertOnly();
        break;
      case 'delete':
        this.psService.sendMessage(true);

        // eslint-disable-next-line no-case-declarations
        const deletePromise = actionsAPI.deleteCaseInCreateStage(this.itemKey);

        deletePromise
          .then(() => {
            this.psService.sendMessage(false);
            this.dismissAlert();
            PCore.getPubSubUtils().publish(PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL);
          })
          .catch(() => {
            this.psService.sendMessage(false);
            this.sendMessage(this.localizedVal('Delete failed.', this.localeCategory));
          });
        break;
      default:
        break;
    }
  }
}
