import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { Utils } from '@pega/angular-sdk-components';
import { QUICK_LINKS_DATA } from './quick-create.utils';
import { MasonryDirective } from '../../directives/masonry.directive';

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
  imports: [CommonModule, MatIcon, MasonryDirective]
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

  ngOnInit() {
    this.initComponent();
  }

  createCase(className) {
    this.pConn$
      .getActionsApi()
      .createWork(className, {} as any)
      .catch(error => {
        console.log('Error in case creation: ', error?.message);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { pConn$ } = changes;

    if (pConn$.previousValue && pConn$.previousValue !== pConn$.currentValue) {
      this.updateSelf();
    }
  }

  initComponent() {
    this.configProps$ = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps()) as QuickCreateProps;
    this.heading$ = this.configProps$.heading;
    this.showCaseIcons$ = this.configProps$.showCaseIcons;
    this.classFilter$ = this.configProps$.classFilter;
    const cases: any = [];
    const defaultCases: any = [];
    const envInfo = PCore.getEnvironmentInfo();
    if (envInfo?.environmentInfoObject?.pyCaseTypeList) {
      envInfo.environmentInfoObject.pyCaseTypeList.forEach((casetype: any) => {
        if (casetype.pyWorkTypeName && casetype.pyWorkTypeImplementationClassName) {
          defaultCases.push({
            classname: casetype.pyWorkTypeImplementationClassName,
            onClick: () => {
              this.createCase(casetype.pyWorkTypeImplementationClassName);
            },
            label: casetype.pyWorkTypeName
          });
        }
      });
    } else {
      const pConnectInAppContext = PCore.createPConnect({
        options: { context: PCore.getConstants().APP.APP }
      }).getPConnect();
      const pyPortalInAppContext = pConnectInAppContext.getValue('pyPortal') as any;
      pyPortalInAppContext?.pyCaseTypesAvailableToCreate?.forEach(casetype => {
        if (casetype.pyClassName && casetype.pyLabel) {
          defaultCases.push({
            classname: casetype.pyClassName,
            onClick: () => {
              this.createCase(casetype.pyClassName);
            },
            label: casetype.pyLabel
          });
        }
      });
    }

    /* If classFilter is not empty - filter from the list of defaultCases */
    if (this.classFilter$?.length > 0) {
      this.classFilter$.forEach(item => {
        defaultCases.forEach(casetype => {
          if (casetype.classname === item) {
            cases.push(casetype);
          }
        });
      });
      this.cases$ = cases;
    } else {
      this.cases$ = defaultCases;
    }

    const cardMap = new Map(QUICK_LINKS_DATA.map(card => [card.title, card]));

    const mergedCases = this.cases$.map(caseItem => {
      const matchingCard = cardMap.get(caseItem.label);

      if (matchingCard) {
        return { ...caseItem, ...matchingCard };
      }
      return caseItem;
    });
    this.cases$ = mergedCases;
  }

  updateSelf() {
    this.initComponent();
  }

  getImagePath(iconName: string): string {
    return this.utils.getImageSrc(iconName, this.utils.getSDKStaticContentUrl());
  }
}
