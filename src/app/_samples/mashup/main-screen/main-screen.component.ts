import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerService } from 'angular-sdk-library';
import { ResolutionScreenComponent } from 'angular-sdk-library';
import { RootContainerComponent } from 'angular-sdk-library';
import { BundleSwatchComponent } from 'angular-sdk-library';

declare function loadMashup(targetDom, preLoadComponents);

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss'],
  standalone: true,
  imports: [CommonModule, BundleSwatchComponent, ResolutionScreenComponent, RootContainerComponent]
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

  constructor(private psservice: ProgressSpinnerService) {}

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
      calling: ''
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
      calling: ''
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
      calling: ' & International'
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
    this.PCore$.getPubSubUtils().unsubscribe(
      this.PCore$.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL,
      'cancelAssignment'
    );

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

    let actionsApi = this.pConn$.getActionsApi();
    let createWork = actionsApi.createWork.bind(actionsApi);
    let sFlowType = 'pyStartCase';

    this.psservice.sendMessage(true);

    let actionInfo;
    const accessGroup = sessionStorage.getItem('userAccessGroup');

    let portalName = accessGroup;
    let pCore: any;
    if (window.PCore) {
      pCore = window.PCore;

      portalName = pCore.getEnvironmentInfo().getApplicationLabel();
    }

    if (portalName.toLowerCase().includes('cableco')) {
      actionInfo = {
        containerName: 'primary',
        flowType: sFlowType ? sFlowType : 'pyStartCase',
        caseInfo: {
          content: {
            Package: sLevel
          }
        }
      };

      createWork('CableC-CableCon-Work-Service', actionInfo);
    } else if (portalName.toLowerCase().includes('mediaco')) {
      actionInfo = {
        containerName: 'primary',
        flowType: sFlowType ? sFlowType : 'pyStartCase',
        caseInfo: {
          content: {
            Package: sLevel
          }
        }
      };

      createWork('DIXL-MediaCo-Work-NewService', actionInfo);
    }
  }

  onShopNow(sLevel: string) {
    this.createWork(sLevel);
  }
}
