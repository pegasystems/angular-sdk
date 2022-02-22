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

    this.caseTypeUrl = this.scservice.getBaseUrl() + endpoints.API + endpoints.CASETYPES;

    caseHeaders = caseHeaders.append('Authorization',  sessionStorage.getItem("authHdr"));

    caseHeaders = caseHeaders.append('Content-Type', "application/json");

    return this.http.get(this.caseTypeUrl,
      { observe: 'response', params: caseParams, headers: caseHeaders});   
  }


}
