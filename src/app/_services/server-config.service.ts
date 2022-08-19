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

    if ((this.getSdkConfigServer().appPortal !== "") &&
        (this.getSdkConfigServer().appPortal !== undefined) ) {
          // use the specified portal
          console.log(`Using appPortal: ${this.getSdkConfigServer().appPortal}`);
          return;
    }
  
    const userAccessGroup = this.PCore.getEnvironmentInfo().getAccessGroup();
    const dataPageName = "D_OperatorAccessGroups";
    const serverUrl = this.getBaseUrl();
    const appAlias = this.getSdkConfigServer().appAlias;
    const appAliasPath = appAlias ? `app/${appAlias}/` : '';
    let fetchHeaders = {};

    fetchHeaders["Authorization"] = Utils.sdkGetAuthHeader();
  
    fetchHeaders["Content-Type"] = "application/json";
  
      await fetch ( `${serverUrl}${appAliasPath}${endpoints.API}${endpoints.DATA}/${dataPageName}`,
        {
          method: 'GET',
          headers: fetchHeaders
        })
        .then( response => response.json())
        .then( async (agData) => {
  
          let arAccessGroups = agData.pxResults;
  
          for (let ag of arAccessGroups) {
            if (ag.pyAccessGroup === userAccessGroup) {
              // Found operator's current access group. Use its portal
              this.setSdkConfigServer("appPortal", ag.pyPortal);
              break;
            }
          }
      });
  
  }

}
