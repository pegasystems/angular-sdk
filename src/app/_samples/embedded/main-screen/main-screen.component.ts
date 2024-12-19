import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentMapperComponent, ProgressSpinnerService, ServerConfigService } from '@pega/angular-sdk-components';

import { ResolutionScreenComponent } from '../resolution-screen/resolution-screen.component';
import { ShoppingCardComponent } from '../shopping-card/shopping-card.component';
import { shoppingOptions } from '../utils';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss'],
  standalone: true,
  imports: [CommonModule, ShoppingCardComponent, ComponentMapperComponent, ResolutionScreenComponent]
})
export class MainScreenComponent implements OnInit, OnDestroy {
  @Input() pConn$: typeof PConnect;

  shoppingOptionsList = shoppingOptions;

  showPega$ = false;
  showTriplePlayOptions$ = true;
  showResolution$ = false;

  constructor(
    private psservice: ProgressSpinnerService,
    private scservice: ServerConfigService
  ) {}

  ngOnInit(): void {
    PCore.getPubSubUtils().subscribe(
      PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL,
      () => {
        this.cancelAssignment();
      },
      'cancelAssignment'
    );

    PCore.getPubSubUtils().subscribe(
      'assignmentFinished',
      () => {
        this.assignmentFinished();
      },
      'assignmentFinished'
    );
  }

  ngOnDestroy() {
    PCore.getPubSubUtils().unsubscribe(PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL, 'cancelAssignment');

    PCore.getPubSubUtils().unsubscribe('assignmentFinished', 'assignmentFinished');
  }

  cancelAssignment() {
    this.showTriplePlayOptions$ = true;
    this.showPega$ = false;
  }

  assignmentFinished() {
    this.showResolution$ = true;
    this.showPega$ = false;

    this.psservice.sendMessage(false);
  }

  createWork(sLevel: string) {
    this.showTriplePlayOptions$ = false;
    this.showPega$ = true;

    this.scservice.getSdkConfig().then(sdkConfig => {
      let mashupCaseType = sdkConfig.serverConfig.appMashupCaseType;
      if (!mashupCaseType) {
        // @ts-ignore - Object is possibly 'null'
        const caseTypes: any = PCore.getEnvironmentInfo().environmentInfoObject.pyCaseTypeList;
        mashupCaseType = caseTypes[0].pyWorkTypeImplementationClassName;
      }

      const options: any = {
        pageName: 'pyEmbedAssignment',
        startingFields:
          mashupCaseType === 'DIXL-MediaCo-Work-NewService'
            ? {
                Package: sLevel
              }
            : {}
      };
      PCore.getMashupApi()
        .createCase(mashupCaseType, PCore.getConstants().APP.APP, options)
        .then(() => {
          console.log('createCase rendering is complete');
        });
    });
  }

  onShopNow(sLevel: string) {
    this.createWork(sLevel);
  }
}
