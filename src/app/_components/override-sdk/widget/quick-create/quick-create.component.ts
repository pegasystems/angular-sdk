import { Component, Input, OnChanges, OnInit, SimpleChanges, forwardRef } from '@angular/core';
import { Utils } from '@pega/angular-sdk-components';
import { CommonModule } from '@angular/common';
import { ComponentMapperComponent } from '@pega/angular-sdk-components';

interface QuickCreateProps {
  // If any, enter additional props that only exist on this component
  heading?: string;
  showCaseIcons?: boolean;
  classFilter?: any;
}

@Component({
  selector: 'app-quick-create',
  templateUrl: './quick-create.component.html',
  styleUrls: ['./quick-create.component.scss'],
  standalone: true,
  imports: [CommonModule, forwardRef(() => ComponentMapperComponent)]
})
export class QuickCreateComponent implements OnInit, OnChanges {
  @Input() pConn$: typeof PConnect;
  @Input() formGroup$: any;

  configProps$: QuickCreateProps;
  arChildren$: any[];
  heading$?: string;
  showCaseIcons$?: boolean;
  classFilter$: any;
  cases$: any = [];

  constructor(private utils: Utils) {}

  createCase(item) {
    console.log('item', item);
    // this.pConn$
    //   .getActionsApi()
    //   .createWork(className, {} as any)
    //   .catch(error => {
    //     console.log('Error in case creation: ', error?.message);
    //   });
    let mashupCaseType; // = sdkConfig.serverConfig.appMashupCaseType;
    if (!mashupCaseType) {
      // const caseTypes = PCore.getEnvironmentInfo().environmentInfoObject.pyCaseTypeList;
      mashupCaseType = item;
    }

    const options: any = {
      pageName: 'pyEmbedAssignment',
      startingFields:
        mashupCaseType === 'DIXL-MediaCo-Work-NewService'
          ? {
              Package: ''
            }
          : {}
    };

    (PCore.getMashupApi().createCase(mashupCaseType, PCore.getConstants().APP.APP, options) as Promise<any>).then(() => {
      console.log('createCase rendering is complete');
    });
  }

  initComponent() {
    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps()) as QuickCreateProps;

    this.heading$ = this.configProps$.heading;
    this.showCaseIcons$ = this.configProps$.showCaseIcons || true;
    this.classFilter$ = Array.isArray(this.configProps$.classFilter) ? this.configProps$.classFilter : [this.configProps$.classFilter];

    const envInfo = PCore.getEnvironmentInfo();
    if (
      this.classFilter$ &&
      envInfo.environmentInfoObject &&
      envInfo.environmentInfoObject.pyCaseTypeList &&
      envInfo.environmentInfoObject.pyCaseTypeList.length > 0
    ) {
      this.classFilter$?.forEach(item => {
        let icon = this.utils.getImageSrc('polaris-solid', this.utils.getSDKStaticContentUrl());
        let label = '';
        envInfo.environmentInfoObject.pyCaseTypeList.forEach(casetype => {
          if (casetype.pyWorkTypeImplementationClassName === item) {
            icon = casetype.pxIcon && this.utils.getImageSrc(casetype?.pxIcon, this.utils.getSDKStaticContentUrl());
            label = casetype.pyWorkTypeName ?? '';
          }
        });
        if (label !== '') {
          this.cases$.push({
            label,
            onClick: () => {
              this.createCase(item);
            },
            ...(this.showCaseIcons$ && { icon })
          });
        }
      });
    }
  }

  ngOnInit() {
    // console.log(`ngOnInit (no registerAndSubscribe!): Region`);
    // this.updateSelf();

    this.initComponent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { pConn$ } = changes;

    if (pConn$.previousValue && pConn$.previousValue !== pConn$.currentValue) {
      this.updateSelf();
    }
  }

  updateSelf() {
    this.initComponent();
  }
}
