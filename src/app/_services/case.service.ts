import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { endpoints } from './endpoints';
import { ServerConfigService } from './server-config.service';


@Injectable({
  providedIn: 'root'
})
export class CaseService {

  constructor(private http: HttpClient,
              private scservice: ServerConfigService) { }

  caseTypeUrl: string;
  //caseTypeUrl = endpoints.BASEURL + endpoints.CASETYPES;


  // get a list of possible case types to create
  getCaseTypes() {
    var caseParams = new HttpParams();
    var caseHeaders = new HttpHeaders();
    const encodedUser = sessionStorage.getItem("encodedUser");

    this.caseTypeUrl = this.scservice.getBaseUrl() + endpoints.API + endpoints.CASETYPES;

    if (sessionStorage.getItem("loginType") === "BASIC") {
      caseHeaders = caseHeaders.append('Authorization', 'Basic ' + encodedUser);
    }
    else {
      // OAUTH
      caseHeaders = caseHeaders.append('Authorization',  sessionStorage.getItem("oauthUser"));
    }

    caseHeaders = caseHeaders.append('Content-Type', "application/json");

    return this.http.get(this.caseTypeUrl,
      { observe: 'response', params: caseParams, headers: caseHeaders});   
  }


}
