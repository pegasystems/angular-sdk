import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { endpoints } from './endpoints';
import { ServerConfigService } from './server-config.service';

@Injectable({
  providedIn: 'root'
})
export class AutoLoginService {

  constructor(private http: HttpClient,
              private scservice: ServerConfigService) { }

  login() {



    let configHeaders = new HttpHeaders();

    // it is expected that scservice.getConfigServer has already been called

    // let encodedBody = new HttpParams()
    //   .set("client_id", endpoints.OAUTHCFG.client_id)
    //   .set("client_secret", endpoints.OAUTHCFG.client_secret)
    //   .set("grant_type", endpoints.OAUTHCFG.grant_type);

    let authConfig = this.scservice.getSdkConfigAuth();

    let encodedBody = new HttpParams()
    .set("client_id", authConfig.mashupClientId)
    .set("client_secret", authConfig.mashupClientSecret)
    .set("grant_type", authConfig.mashupGrantType);

  
    // return this.http.post(endpoints.OAUTHCFG.token,
    // encodedBody,
    // { observe: 'response'});

    return this.http.post(authConfig.accessTokenUri,
      encodedBody,
      { observe: 'response'});



  }

}
