import { Component, OnInit, Input } from '@angular/core';
import { ProgressSpinnerService } from '../../../_messages/progress-spinner.service';
import { ServerConfigService } from 'src/app/_services/server-config.service';

declare function loadMashup(targetDom, preLoadComponents);

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss'],
})
export class MainScreenComponent implements OnInit {
  @Input() pConn$: any;

  PCore$: any;

  firstConfig$: any;
  secondConfig$: any;
  thirdConfig$: any;
  showTriplePlayOptions$: boolean = true;
  showPega$: boolean = false;
  showResolution$: boolean = false;

  constructor(private psservice: ProgressSpinnerService, private serverConfigService: ServerConfigService) {}

  ngOnInit(): void {
    if (!this.PCore$) {
      this.PCore$ = window.PCore;
    }

    // first
    this.firstConfig$ = {
      play: 'Triple Play',
      level: 'Basic',
      channels: '100+',
      channels_full: '100+ (Basic +)',
      banner: 'Value package',
      price: '99.00',
      internetSpeed: '100 Mbps',
      calling: '',
    };

    // second
    this.secondConfig$ = {
      play: 'Triple Play',
      level: 'Silver',
      channels: '125+',
      channels_full: '125+ (Delux)',
      banner: 'Most popular',
      price: '120.00',
      internetSpeed: '300 Mbps',
      calling: '',
    };

    // third
    this.thirdConfig$ = {
      play: 'Triple Play',
      level: 'Gold',
      channels: '175+',
      channels_full: '175+ (Premium)',
      banner: 'All the channels you want',
      price: '150.00',
      internetSpeed: '1 Gbps',
      calling: ' & International',
    };

    this.PCore$.getPubSubUtils().subscribe(
      this.PCore$.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL,
      () => {
        this.cancelAssignment();
      },
      'cancelAssignment'
    );

    this.PCore$.getPubSubUtils().subscribe(
      'assignmentFinished',
      () => {
        this.assignmentFinished();
      },
      'assignmentFinished'
    );
  }

  ngOnDestroy() {
    this.PCore$.getPubSubUtils().unsubscribe(this.PCore$.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL, 'cancelAssignment');

    this.PCore$.getPubSubUtils().unsubscribe('assignmentFinished', 'assignmentFinished');
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

    this.serverConfigService.getSdkConfig().then((sdkConfig) => {
      let mashupCaseType = sdkConfig.serverConfig.appMashupCaseType;
      if (!mashupCaseType) {
        const caseTypes = this.PCore$.getEnvironmentInfo().environmentInfoObject.pyCaseTypeList;
        mashupCaseType = caseTypes[0].pyWorkTypeImplementationClassName;
      }

      const options = {
        pageName: 'pyEmbedAssignment',
        startingFields:
          mashupCaseType === 'DIXL-MediaCo-Work-NewService'
            ? {
                Package: sLevel,
              }
            : {},
      };
      this.PCore$.getMashupApi()
        .createCase(mashupCaseType, this.PCore$.getConstants().APP.APP, options)
        .then(() => {
          console.log('createCase rendering is complete');
        });
    });   
  }

  onShopNow(sLevel: string) {
    this.createWork(sLevel);
  }
}
