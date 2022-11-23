import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Utils } from "../_helpers/utils";
import { endpoints } from '../_services/endpoints';

@Injectable({
  providedIn: 'root'
})
export class ServerConfigService {

  sdkConfig = {};

  PCore: any;


  constructor() { 


  }

 
  getServerConfig(): Promise<any> {
    if( Object.keys(this.sdkConfig).length === 0 ) {
      return  fetch("./sdk-config.json")
        .then ( (response) => {
          if( response.ok ) {
            return response.json();
          } else {
            throw new Error(`Failed with status:${response.status}`);
          }
        })
        .then ( (data) => {
            this.sdkConfig = data;
            this.fixupConfigSettings();
            return Promise.resolve(this.sdkConfig);
        }).catch(err => {
            console.error("Fetch for sdk-config.js failed.");
            console.error(err);
            return Promise.reject(err);
        });
    } else {
      return Promise.resolve(this.sdkConfig);
    }
  }

  // Adjust any settings like setting up defaults or making sure URIs have a trailing slash
  fixupConfigSettings() {
    const oServerConfig = this.sdkConfig["serverConfig"];
    // If not present, then use current root path
    oServerConfig.sdkContentServerUrl = oServerConfig.sdkContentServerUrl || window.location.origin;
    // Needs a trailing slash so add one if not there
    if( !oServerConfig.sdkContentServerUrl.endsWith('/') ) {
      oServerConfig.sdkContentServerUrl = `${oServerConfig.sdkContentServerUrl}/`;
    }    
    console.log(`Using sdkContentServerUrl: ${this.sdkConfig["serverConfig"].sdkContentServerUrl}`);

    if( !oServerConfig.infinityRestServerUrl.endsWith('/') ) {
      oServerConfig.infinityRestServerUrl = `${oServerConfig.infinityRestServerUrl}/`;
    }

    // Specify our own internal list of well known portals to exclude (if one not specified)
    if( !oServerConfig.excludePortals ) {
      oServerConfig.excludePortals = ["pxExpress", "Developer", "pxPredictionStudio", "pxAdminStudio", "pyCaseWorker", "pyCaseManager7"];
      console.warn(`No exludePortals entry found within serverConfig section of sdk-config.json.  Using the following default list: ["pxExpress", "Developer", "pxPredictionStudio", "pxAdminStudio", "pyCaseWorker", "pyCaseManager7"]`);
    }
  }

  async getSdkConfig() : Promise<any> {
    if( Object.keys(this.sdkConfig).length === 0 ) {
      const config = await this.getServerConfig();
    }
    return this.sdkConfig;
  }

  getSdkConfigAuth() : any {
    if( Object.keys(this.sdkConfig).length === 0 ) {
      const config = this.getSdkConfig();
    }
    return this.sdkConfig["authConfig"];
  }

  getSdkConfigServer(): any {
    if( Object.keys(this.sdkConfig).length === 0 ) {
      const config = this.getSdkConfig();
    }
    return this.sdkConfig["serverConfig"];
 }

  setSdkConfigServer(key: string, value: string) {
      this.sdkConfig["serverConfig"][key] = value;
  }

  getBaseUrl(): string {
    return this.getSdkConfigServer().infinityRestServerUrl;
  }


  hasDefinedAppPortal(): boolean {
    if ((this.getAppPortal() !== "") &&
      (this.getAppPortal() !== undefined) ) {
        return true;
    }

    return false;

  }


  getAppPortal(): string {
    return this.getSdkConfigServer().appPortal; 
  }

  /**
   * If sdkConfig.serverConfig.appPortal is set, leave it and the specified portal will be used.
   * If not set, set sdkConfig.serverConfig.appPortal to default portal of currently logged in user
   */
  async selectPortal() {

    if (!this.PCore) {
      this.PCore = window.PCore;
    }

    const serverConfig = this.getSdkConfigServer();
    
    if ((serverConfig.appPortal !== "") &&
        (serverConfig.appPortal !== undefined) ) {
          // use the specified portal
          console.log(`Using appPortal: ${serverConfig.appPortal}`);
          return;
    }
  
    const userAccessGroup = this.PCore.getEnvironmentInfo().getAccessGroup();
    const dataPageName = "D_OperatorAccessGroups";
    const serverUrl = this.getBaseUrl();
    const appAlias = this.getSdkConfigServer().appAlias;
    const appAliasPath = appAlias ? `app/${appAlias}/` : '';
    const arExcludedPortals = serverConfig["excludePortals"];
    let fetchHeaders = {};

    fetchHeaders["Authorization"] = Utils.sdkGetAuthHeader();
  
    fetchHeaders["Content-Type"] = "application/json";
  
    // Using v1 API here as v2 data_views is not able to access same data page currently.  Should move to avoid having this logic to find
    //  a default portal or constellation portal and rather have Constellation JS Engine API just load the default portal
    await fetch ( `${serverUrl}${appAliasPath}${endpoints.API}${endpoints.DATA}/${dataPageName}`,
        {
          method: 'GET',
          headers: fetchHeaders
        })
        .then( response => {
          if( response.ok && response.status === 200) {
            return response.json();
          } else {
            if( response.status === 401 ) {
              // Might be either a real token expiration or revoke, but more likely that the "api" service package is misconfigured
              throw( new Error(`Attempt to access ${dataPageName} failed.  The "api" service package is likely not configured to use "OAuth 2.0"`));
            };
            throw( new Error(`HTTP Error: ${response.status}`));
          }
        })
        .then( async (agData) => {

          let arAccessGroups = agData.pxResults;
          let selectedPortal = null;
  
          for (let ag of arAccessGroups) {
            if (ag.pyAccessGroup === userAccessGroup) {
              // Check if default portal works
              if( !arExcludedPortals.includes(ag.pyPortal) ) {
                selectedPortal = ag.pyPortal;
              } else {
                console.error(`Default portal for current operator (${ag.pyPortal}) is not compatible with SDK.\nConsider using a different operator, adjusting the default portal for this operator, or using "appPortal" setting within sdk-config.json to specify a specific portal to load.`);
                // Find first portal that is not excluded (might work)
                for (let portal of ag.pyUserPortals ) {
                  if( !arExcludedPortals.includes(portal.pyPortalLayout) ) {
                    selectedPortal = portal.pyPortalLayout;
                    break;
                  }
                }
              }
              break;
            }
          }
          if( selectedPortal ) {
            // Found operator's current access group. Use its portal
            this.setSdkConfigServer("appPortal", selectedPortal);
            console.log(`Using appPortal: ${serverConfig.appPortal}`);
          }
        })
        .catch( e => {
          console.error(e.message);
          // check specific error if 401, and wiped out if so stored token is stale.  Fetch new tokens.
        });
    }

}
