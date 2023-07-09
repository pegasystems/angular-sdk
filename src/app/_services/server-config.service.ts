import { Injectable } from '@angular/core';
import { Utils } from '../_helpers/utils';
import { endpoints } from '../_services/endpoints';

@Injectable({
  providedIn: 'root',
})
export class ServerConfigService {
  PCore: any;
  sdkConfig = {};

  constructor() {}

  /**
   * Asynchronous initialization of the config file contents.
   * @returns Promise of config file fetch
   */
  readSdkConfig(): Promise<any> {
    if (Object.keys(this.sdkConfig).length === 0) {
      return fetch('./sdk-config.json')
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error(`Failed with status:${response.status}`);
          }
        })
        .then((data) => {
          this.sdkConfig = data;
          this.fixupConfigSettings();
          return Promise.resolve(this.sdkConfig);
        })
        .catch((err) => {
          console.error('Fetch for sdk-config.js failed.');
          console.error(err);
          return Promise.reject(err);
        });
    } else {
      return Promise.resolve(this.sdkConfig);
    }
  }

  // Adjust any settings like setting up defaults or making sure URIs have a trailing slash
  fixupConfigSettings() {
    const oServerConfig = this.sdkConfig['serverConfig'];
    // If not present, then use current root path
    oServerConfig.sdkContentServerUrl = oServerConfig.sdkContentServerUrl || window.location.origin;
    // Needs a trailing slash so add one if not there
    if (!oServerConfig.sdkContentServerUrl.endsWith('/')) {
      oServerConfig.sdkContentServerUrl = `${oServerConfig.sdkContentServerUrl}/`;
    }
    console.log(`Using sdkContentServerUrl: ${this.sdkConfig['serverConfig'].sdkContentServerUrl}`);

    // Don't want a trailing slash for infinityRestServerUrl
    if (oServerConfig.infinityRestServerUrl.endsWith('/')) {
      oServerConfig.infinityRestServerUrl = oServerConfig.infinityRestServerUrl.slice(0, -1);
    }

    // Specify our own internal list of well known portals to exclude (if one not specified)
    if (!oServerConfig.excludePortals) {
      oServerConfig.excludePortals = ['pxExpress', 'Developer', 'pxPredictionStudio', 'pxAdminStudio', 'pyCaseWorker', 'pyCaseManager7'];
      console.warn(
        `No exludePortals entry found within serverConfig section of sdk-config.json.  Using the following default list: ["pxExpress", "Developer", "pxPredictionStudio", "pxAdminStudio", "pyCaseWorker", "pyCaseManager7"]`
      );
    }
  }

  /**
   *
   * @returns the sdk-config JSON object
   */
  async getSdkConfig(): Promise<any> {
    if (Object.keys(this.sdkConfig).length === 0) {
      await this.readSdkConfig();
    }
    return this.sdkConfig;
  }

  /**
   *
   * @returns the authConfig block in the SDK Config object
   */
  async getSdkConfigAuth(): Promise<any> {
    if (Object.keys(this.sdkConfig).length === 0) {
      await this.getSdkConfig();
    }
    return this.sdkConfig['authConfig'];
  }

  /**
   *
   * @returns the serverConfig bloc from the sdk-config.json file
   */
  getSdkConfigServer(): any {
    if (Object.keys(this.sdkConfig).length === 0) {
      const config = this.getSdkConfig();
    }
    return this.sdkConfig['serverConfig'];
  }

  /**
   * @param {String} key the key to be inserted/updated in serverConfig
   * @param {String} value the value to be assigned to the given key
   */
  setSdkConfigServer(key: string, value: string) {
    this.sdkConfig['serverConfig'][key] = value;
  }

  getBaseUrl(): string {
    return this.getSdkConfigServer().infinityRestServerUrl;
  }

  /**
   * Get available portals which supports SDK
   * @returns list of available portals (portals other than excludingPortals list)
   */
  async getAvailablePortals() {
    return new Promise((resolve, reject) => {
      if (!this.PCore) {
        this.PCore = window.PCore;
      }

      const serverConfig = this.getSdkConfigServer();

      const userAccessGroup = this.PCore.getEnvironmentInfo().getAccessGroup();
      const dataPageName = 'D_OperatorAccessGroups';
      const serverUrl = this.getBaseUrl();
      const appAlias = this.getSdkConfigServer().appAlias;
      const appAliasPath = appAlias ? `app/${appAlias}/` : '';
      const arExcludedPortals = serverConfig['excludePortals'];
      let headers = {
        Authorization: Utils.sdkGetAuthHeader(),
        'Content-Type': 'application/json',
      };

      // Using v1 API here as v2 data_views is not able to access same data page currently.  Should move to avoid having this logic to find
      //  a default portal or constellation portal and rather have Constellation JS Engine API just load the default portal
      fetch(`${serverUrl}${appAliasPath}${endpoints.API}${endpoints.DATA}/${dataPageName}`, {
        method: 'GET',
        headers,
      })
        .then((response) => {
          if (response.ok && response.status === 200) {
            return response.json();
          } else {
            if (response.status === 401) {
              // Might be either a real token expiration or revoke, but more likely that the "api" service package is misconfigured
              throw new Error(`Attempt to access ${dataPageName} failed.  The "api" service package is likely not configured to use "OAuth 2.0"`);
            }
            throw new Error(`HTTP Error: ${response.status}`);
          }
        })
        .then(async (agData) => {
          const arAccessGroups = agData.pxResults;
          const availablePortals: Array<any> = [];

          for (let ag of arAccessGroups) {
            if (ag.pyAccessGroup === userAccessGroup) {
              console.error(
                `Default portal for current operator (${ag.pyPortal}) is not compatible with SDK.\nConsider using a different operator, adjusting the default portal for this operator, or using "appPortal" setting within sdk-config.json to specify a specific portal to load.`
              );
              for (let portal of ag.pyUserPortals) {
                if (!arExcludedPortals.includes(portal.pyPortalLayout)) {
                  availablePortals.push(portal.pyPortalLayout);
                }
              }
              break;
            }
          }

          // Found operator's current access group. Use its portal
          console.log(`Available portals: ${availablePortals}`);

          resolve(availablePortals);
        })
        .catch((e) => {
          console.error(e.message);
          // check specific error if 401, and wiped out if so stored token is stale.  Fetch new tokens.
        });
    });
  }
}
