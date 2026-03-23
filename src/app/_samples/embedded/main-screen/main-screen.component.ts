import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResolutionScreenComponent } from '../resolution-screen/resolution-screen.component';
import { ShoppingCardComponent } from '../shopping-card/shopping-card.component';
import { ServerConfigService } from '@pega/angular-sdk-components';
import { ComponentMapperComponent } from '@pega/angular-sdk-components';
import { shoppingOptions } from '../utils';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss', '../EmbeddedStyles.scss'],
  imports: [CommonModule, ShoppingCardComponent, ComponentMapperComponent, ResolutionScreenComponent]
})
export class MainScreenComponent implements OnInit, OnDestroy {
  @Input() pConn$: typeof PConnect;

  shoppingOptionsList = shoppingOptions;

  showPega$ = false;
  showTriplePlayOptions$ = true;
  showResolution$ = false;

  constructor(private scservice: ServerConfigService) {}

  ngOnInit(): void {
    // Subscribe to the EVENT_CANCEL event to handle the assignment cancellation
    PCore.getPubSubUtils().subscribe(PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL, () => this.cancelAssignment(), 'cancelAssignment');

    PCore.getPubSubUtils().subscribe(
      PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.END_OF_ASSIGNMENT_PROCESSING,
      () => this.assignmentFinished(),
      'endOfAssignmentProcessing'
    );
  }

  ngOnDestroy() {
    PCore.getPubSubUtils().unsubscribe(PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL, 'cancelAssignment');
    PCore.getPubSubUtils().unsubscribe(PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.END_OF_ASSIGNMENT_PROCESSING, 'endOfAssignmentProcessing');
  }

  cancelAssignment() {
    this.showTriplePlayOptions$ = true;
    this.showPega$ = false;
  }

  assignmentFinished() {
    this.showResolution$ = true;
    this.showPega$ = false;
  }

  onShopNow(optionClicked: string) {
    this.showTriplePlayOptions$ = false;
    this.showPega$ = true;

    this.scservice.getSdkConfig().then(sdkConfig => {
      let mashupCaseType = sdkConfig.serverConfig.appMashupCaseType;
      if (!mashupCaseType) {
        const caseTypes: any = PCore.getEnvironmentInfo().environmentInfoObject?.pyCaseTypeList;
        if (caseTypes && caseTypes.length > 0) {
          mashupCaseType = caseTypes[0].pyWorkTypeImplementationClassName;
        }
      }
      let selectedPhoneGUID = '';
      const phoneName = optionClicked ? optionClicked.trim() : '';

      switch (phoneName) {
        case 'Oceonix 25 Max':
          selectedPhoneGUID = '2455b75e-3381-4a34-b7db-700dba34a670';
          break;
        case 'Oceonix 25 Ultra':
          selectedPhoneGUID = '535f01f3-a702-4655-bcd0-f1d9c1599a9c';
          break;
        case 'Oceonix 25':
        default:
          // Set 'Oceonix 25' as the default/fallback
          selectedPhoneGUID = '0f670ae2-3e61-47d4-b426-edd62558cfb8';
          break;
      }
      const options: {
        pageName: string;
        startingFields: { [key: string]: any };
      } = {
        pageName: 'pyEmbedAssignment',
        startingFields: {}
      };
      if (mashupCaseType === 'DIXL-MediaCo-Work-PurchasePhone') {
        options.startingFields['PhoneModelss'] = {
          pyGUID: selectedPhoneGUID
        };
      } else {
        console.warn(`Unexpected case type: ${mashupCaseType}. PhoneModelss field not set.`);
      }
      PCore.getMashupApi()
        .createCase(mashupCaseType, PCore.getConstants().APP.APP, options)
        .then(() => {
          console.log('createCase rendering is complete');
        });
    });
  }
}
