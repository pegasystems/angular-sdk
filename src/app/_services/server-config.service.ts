import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServerConfigService {

  sdkConfig = {};

  PCore: any;


  constructor() { 


  }

 
   getServerConfig(): Promise<any> {
      if (JSON.stringify(this.sdkConfig) === "{}" ) {
        return  fetch("./sdk-config.json")
        .then (response => response.json())
        .then ( (data) => {
            this.sdkConfig = data;

            return this;
        }).catch(err => {
            console.error("Fetch for sdk-config.js failed.");
            console.error(err);
        });
      }
      else {
        return Promise.resolve(this.sdkConfig);
      }


  }

  async initServerConfig() {
    if (JSON.stringify(this.sdkConfig) != "{}") {
      return;
    }
    
    const response = await fetch("./sdk-config.json");
    const data = await response.json();
    this.sdkConfig = data;


  }

  getSdkConfig() : any {
      return this.sdkConfig;
  }

  getSdkConfigAuth() : any {
      return this.getSdkConfig().authConfig;

  }

  getSdkConfigServer(): any {
      return this.getSdkConfig().serverConfig;
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
   * If ConfigAccess.sdkConfig.serverConfig.appPortal is set, leave it and the specified portal will be used.
   * If not set, set SdkConfigAccess.serverConfig.appPortal to default portal of currently logged in user
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
      const encodedUser = sessionStorage.getItem("encodedUser");
      let fetchHeaders = {};


      if (sessionStorage.getItem("loginType") === "BASIC") {
        fetchHeaders["Authorization"] = 'Basic ' + encodedUser
      }
      else {
        // OAUTH
        fetchHeaders["Authorization"] = sessionStorage.getItem("oauthUser");
      }
  
      fetchHeaders["Content-Type"] = "application/json";
  
      await fetch ( serverUrl + "/api/v1/data/" + dataPageName,
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
