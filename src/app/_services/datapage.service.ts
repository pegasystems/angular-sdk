import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { endpoints } from './endpoints';
import { ServerConfigService } from './server-config.service';
import { Utils } from "../_helpers/utils";


@Injectable({
  providedIn: 'root'
})
export class DatapageService {

  constructor(private http: HttpClient,
              private scService: ServerConfigService) {}
  

  //dataPageUrl = endpoints.BASEURL + endpoints.DATA;
  //dataPageUrl = this.scService.getBaseUrl() + endpoints.API + endpoints.DATA;
  dataPageUrl: string;

  pxResults: Object;


  getDataPage(id, dpParams) {

    this.dataPageUrl = this.scService.getBaseUrl() + endpoints.API + endpoints.DATA;

    let dataHeaders = new HttpHeaders();

    dataHeaders = dataHeaders.append('Authorization',  Utils.sdkGetAuthHeader());
    
    dataHeaders = dataHeaders.append('Content-Type', "application/json");

    return this.http.get(this.dataPageUrl + "/" + id,
      { observe: 'response', params: dpParams, headers: dataHeaders});   
  }

  getResults(response) {
    return response.pxResults;
  }
}

