// import * as moment from "moment";
import { Injectable } from '@angular/core';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as localizedFormat from 'dayjs/plugin/localizedFormat';
import * as relativeTime from 'dayjs/plugin/relativeTime';
import { ServerConfigService } from '../_services/server-config.service';

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

@Injectable()
export class Utils {
  lastControlID: number = 0;

  viewContainerCount: number = 0;

  constructor(private scService: ServerConfigService) {}

  getSDKStaticContentUrl() {
    const sdkConfigServer = this.scService.getSdkConfigServer();

    // NOTE: Needs a trailing slash! So add one if not provided
    if (!sdkConfigServer.sdkContentServerUrl.endsWith('/')) {
      sdkConfigServer.sdkContentServerUrl = `${sdkConfigServer.sdkContentServerUrl}/`;
    }

    return `${sdkConfigServer.sdkContentServerUrl}constellation/`;
  }  


  consoleKidDump(pConn: any, level: number = 1, kidNum: number = 1) {
    let sDash = '';
    for (var i = 0; i < level; i++) {
      sDash = sDash.concat('-');
    }
    let cName = 'blank';
    let ctxName = '';
    try {
      cName = pConn.getComponentName();
      ctxName = pConn.getContextName();
      console.log(sDash + 'level ' + level + ' component(' + kidNum + '):' + cName + ' context:' + ctxName);
      if (pConn.getConfigProps() != null) {
        console.log(sDash + 'configProps:' + JSON.stringify(pConn.getConfigProps()));
      }
      if (pConn.getRawMetadata() != null) {
        console.log(sDash + 'rawMetadata:' + JSON.stringify(pConn.getRawMetadata()));
      }

      if (pConn.hasChildren() && pConn.getChildren() != null) {
        console.log(sDash + 'kidCount:' + pConn.getChildren().length);
        let kids = pConn.getChildren();
        for (let index in kids) {
          let kid = kids[index];
          this.consoleKidDump(kid.getPConnect(), level + 1, parseInt(index) + 1);
        }
      }
    } catch (ex) {}
  }

  htmlDecode(sVal: string): string {
    let doc = new DOMParser().parseFromString(sVal, 'text/html');
    return doc.documentElement.textContent;
  }

  getUniqueControlID(): string {
    var sPrefix = 'control-';

    this.lastControlID++;

    return sPrefix + this.lastControlID.toString();
  }

  getOptionList(configProps: any, dataObject: any): Array<any> {
    let listType = configProps.listType;
    let arReturn: Array<any>;

    if (listType != null) {
      switch (listType.toLowerCase()) {
        case 'associated':
          // data source should be an array
          if (typeof configProps.datasource == 'object') {
            arReturn = configProps.datasource;
          }
          break;
        case 'datapage':
          // get data page
          // eslint-disable-next-line no-case-declarations
          let dataPage = configProps.datasource;
          if (dataObject[dataPage]) {
            alert('need to handle data page');
          } else {
            let listSourceItems = configProps.listOutput;
            if (typeof dataPage === 'object' && !Array.isArray(listSourceItems)) {
              listSourceItems = dataPage.source ? dataPage.source : [];
            }
            (listSourceItems || []).forEach((item) => {
              item.value = item.text ? item.text : item.value;
            });
            arReturn = listSourceItems || [];
          }
          break;
      }
    }

    return arReturn;
  }

  getInitials(userName: string): string {
    let userInitials = userName;

    if (userName && userName != '') {
      userInitials = userName.charAt(0);

      if (userName.lastIndexOf(' ') > 0) {
        let lastName = userName.substring(userName.lastIndexOf(' ') + 1);
        userInitials += lastName.charAt(0);
      } else if (userName.lastIndexOf('.') > 0) {
        let lastName = userName.substring(userName.lastIndexOf('.') + 1);
        userInitials += lastName.charAt(0);
      }
    } else {
      userInitials = '';
    }

    return userInitials.toUpperCase();
  }

  getImageSrc(name: string, serverUrl: string): string {
    let iconName = name.replace('pi-', '').replace('pi ', '').trim();
    if (iconName === 'line-chart') {
      iconName = 'chart-line';
    }

    //return serverUrl.concat("assets/icons/").concat(iconName).concat(".svg");
    return this.getIconPath(serverUrl).concat(iconName).concat('.svg');
  }

  getIconPath(serverUrl: string): string {
    return serverUrl.concat('assets/icons/');
  }

  getBooleanValue(inValue: any): boolean {
    let bReturn = false;

    if (typeof inValue == 'string') {
      if (inValue.toLowerCase() == 'true') {
        bReturn = true;
      }
    } else {
      bReturn = inValue;
    }

    return bReturn;
  }

  generateDate(dateVal, dateFormat) {
    let sReturnDate = dateVal;

    if (dateVal == null || dateVal == '') {
      return dateVal;
    }

    // Commenting out per Vinod note in webc components
    // VRS: Dont think we need the below line.  Commenting out for now. (2020.05.20)
    // if date has a ".", then of the format YYYMMDD[T]HHmmss[.]SSS Z, need to change to YYYYMMDD
    // if (dateVal.indexOf(".") >= 0) {
    //   dateVal = moment(dateVal.replace("GMT", "+0000"), "YYYYMMDD[T]HHmmss[.]SSS Z").format("YYYYMMDD");
    //   sReturnDate = dateVal;
    // }

    switch (dateFormat) {
      case 'Date-Short':
        // 1/1/01
        sReturnDate = dayjs(dateVal).format('M/D/YY');
        break;
      case 'Date-Short-YYYY':
        // 1/1/2001
        sReturnDate = dayjs(dateVal).format('M/D/YYYY');
        break;
      case 'Date-Short-Custom':
        // 01/01/01
        sReturnDate = dayjs(dateVal).format('MM/DD/YY');
        break;
      case 'Date-Short-Custom-YYYY':
        // 01/01/2001
        sReturnDate = dayjs(dateVal).format('L');
        break;
      case 'Date-Long-Custom-YYYY':
        // 05/22/2021
        sReturnDate = dayjs(dateVal).format('MM/DD/YYYY');
        break;
      case 'Date':
      case 'Date-Medium':
        // Jan 1, 2001
        sReturnDate = dayjs(dateVal).format('ll');
        break;
      case 'Date-DayMonthYear-Custom':
        // 01-Jan-2001
        sReturnDate = dayjs(dateVal).format('DD-MMM-YYYY');
        break;
      case 'Date-Full':
        // Monday, January 1, 2001
        sReturnDate = dayjs(dateVal).format('dddd, MMMM D, YYYY');
        break;
      case 'DateTime-Frame':
      case 'DateTime-Frame-Short':
      case 'DateTime-Since':
        // 2 days, 5 hours ago
        sReturnDate = dayjs(dateVal).fromNow();
        break;
      case 'Date-Long':
        // January 1, 2001
        sReturnDate = dayjs(dateVal).format('MMMM D, YYYY');
        break;
      case 'Date-ISO-8601':
        // 2001/01/01 y/m/d
        sReturnDate = dayjs(dateVal).format('YYYY/MM/DD');
        break;
      case 'Date-Gregorian-1':
        // 01 January, 2001
        sReturnDate = dayjs(dateVal).format('DD MMMM, YYYY');
        break;
      case 'Date-Gregorian-2':
        // January 01, 2001
        sReturnDate = dayjs(dateVal).format('MMMM DD, YYYY');
        break;
      case 'Date-Gregorian-3':
        // 2001, January 01
        sReturnDate = dayjs(dateVal).format('YYYY, MMMM DD');
        break;
      case 'DateTime-Custom':
        break;
    }

    return sReturnDate;
  }

  generateDateTime(dateTimeVal, dateFormat) {
    let sReturnDate = dateTimeVal;

    if (dateTimeVal == null || dateTimeVal == '') {
      return dateTimeVal;
    }

    dateTimeVal = dateTimeVal.replace('GMT', '+0000');

    switch (dateFormat) {
      case 'DateTime-Short':
        // 1/1/01 1:00 AM
        sReturnDate = dayjs(dateTimeVal).format('M/D/YY h:mm A');
        break;
      case 'DateTime-Short-Custom':
        // 01/01/01 01:00 AM
        sReturnDate = dayjs(dateTimeVal).format('MM/DD/YY hh:mm A');
        break;
      case 'DateTime-Short-YYYY-Custom':
        // 01/01/2001 01:00 AM
        sReturnDate = dayjs(dateTimeVal).format('M/D/YYYY hh:mm A');
        break;
      case 'DateTime-Long-YYYY-Custom':
        // 01/01/01 01:00 AM
        sReturnDate = dayjs(dateTimeVal).format('MM/DD/YYYY, hh:mm A');
        break;
      case 'DateTime-Short-YYYY':
        // 1/1/2001 1:00 AM
        sReturnDate = dayjs(dateTimeVal).format('M/D/YYYY h:mm A');
        break;
      case 'DateTime-Medium':
        // Jan 1, 2001 1:00:00 AM
        sReturnDate = dayjs(dateTimeVal).format('MMM D, YYYY h:mm:ss A');
        break;
      case 'DateTime-Long':
        // January 1, 2001 1:00:00 AM
        sReturnDate = dayjs(dateTimeVal).format('MMMM D, YYYY h:mm:ss A');
        break;
      case 'DateTime-DayMonthYear-Custom':
        // 01-Jan-2001 1:00:00 AM
        sReturnDate = dayjs(dateTimeVal).format('DD-MMM-YYYY h:mm:ss A');
        break;
      case 'DateTime-Full':
        // Monday, January 1, 2001 1:00 AM EDT
        sReturnDate = dayjs(dateTimeVal).format('dddd, MMMM D, YYYY h:mm A z');
        break;
      case 'DateTime-Frame':
      case 'DateTime-Frame-Short':
      case 'DateTime-Since':
        // 2 days, 5 hours ago
        sReturnDate = dayjs(dateTimeVal).fromNow();
        break;
      case 'DateTime-ISO-8601':
        // 2001/01/01 1:00:00 AM     y/m/d
        sReturnDate = dayjs(dateTimeVal).format('YYYY/MM/DD h:mm:ss A');
        break;
      case 'DateTime-Gregorian-1':
        // 01 January, 2001 1:00:00 AM
        sReturnDate = dayjs(dateTimeVal).format('DD MMMM, YYYY h:mm:ss A');
        break;
      case 'DateTime-Gregorian-2':
        // January 01, 2001 1:00:00 AM
        sReturnDate = dayjs(dateTimeVal).format('MMMM DD, YYYY h:mm:ss A');
        break;
      case 'DateTime-Gregorian-3':
        // 2001, January 01 1:00:00 AM
        sReturnDate = dayjs(dateTimeVal).format('YYYY, MMMM DD h:mm:ss A');
        break;
      case 'DateTime-Custom':
        break;
    }

    return sReturnDate;
  }

  getSeconds(sTime): any {
    return dayjs(sTime).valueOf();
  }

  getIconFromFileType(fileType): string {
    let icon = 'document-doc';
    if (!fileType) return icon;
    if (fileType.startsWith('audio')) {
      icon = 'audio';
    } else if (fileType.startsWith('video')) {
      icon = 'video';
    } else if (fileType.startsWith('image')) {
      icon = 'picture';
    } else if (fileType.includes('pdf')) {
      icon = 'document-pdf';
    } else {
      const [, subtype] = fileType.split('/');
      const foundMatch = (sources) => {
        return sources.some((key) => subtype.includes(key));
      };

      if (foundMatch(['excel', 'spreadsheet'])) {
        icon = 'document-xls';
      } else if (foundMatch(['zip', 'compressed', 'gzip', 'rar', 'tar'])) {
        icon = 'document-compress';
      }
    }

    return icon;
  }

  getIconForAttachment(attachment) {
    let icon;
    switch (attachment.type) {
      case 'FILE':
        icon = this.getIconFromFileType(attachment.mimeType);
        break;
      case 'URL':
        icon = 'chain';
        break;
      default:
        icon = 'document-doc';
    }
    return icon;
  }

  addViewContainer() {
    if (sessionStorage.getItem('viewContainerCount') == null) {
      sessionStorage.setItem('viewContainerCount', '0');
    }

    let count = parseInt(sessionStorage.getItem('viewContainerCount'));
    count++;

    sessionStorage.setItem('viewContainerCount', count.toString());
  }

  removeViewContainer() {
    return;

    let count = parseInt(sessionStorage.getItem('viewContainerCount'));
    count--;

    sessionStorage.setItem('viewContainerCount', count.toString());
  }

  okToAddContainerToVC(): boolean {
    if (sessionStorage.getItem('viewContainerCount') == null) {
      sessionStorage.setItem('viewContainerCount', '0');
    }

    let count = parseInt(sessionStorage.getItem('viewContainerCount'));

    if (count == 0) {
      return true;
    } else {
      return false;
    }
  }

  getUserId = (user) => {
    let userId = '';
    if (typeof user === 'object' && user !== null && user.userId) {
      userId = user.userId;
    } else if (typeof user === 'string' && user) {
      userId = user;
    }
    return userId;
  };

  static sdkGetAuthHeader(): string {
    return sessionStorage.getItem('asdk_AH');
  }

  static isEmptyObject(obj: Object): Boolean {
    return Object.keys(obj).length === 0;
  }
}
