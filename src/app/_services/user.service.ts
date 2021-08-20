import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { endpoints,loginBoxType} from './endpoints';
import { UserManager, Log } from 'oidc-client';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { interval } from "rxjs/internal/observable/interval";
import { ThrowStmt } from '@angular/compiler';
import { OAuthResponseService } from '../_messages/oauth-response.service';
import { ServerConfigService } from './server-config.service';
import { Server } from 'http';



@Injectable({
  providedIn: 'root'
})



export class UserService {

  authUrl: string;

  //authUrl = endpoints.BASEURL + endpoints.AUTH;
  //oAuthJSO : any = null;

  oAuthJSO: any;
  userManager: any;
  userManagerConfig: any;

  bInit: boolean = false;


  constructor(private http: HttpClient,
              private scservice: ServerConfigService,
              private oarservice: OAuthResponseService) { 

    
    this.scservice.getServerConfig().then(() => {
      this.initConfig();
    });


    


    
  }

  initConfig() {
    //let oAuthConfig = endpoints.OAUTHCFG;
    let authConfig = this.scservice.getSdkConfigAuth();


    this.userManagerConfig = authConfig ? {
      /* client_id: oAuthConfig.client_id,*/

      client_id: sessionStorage.getItem("clientID"),
      // redirect_uri: oAuthConfig.loginExperience == loginBoxType.Main ?
      //     `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}${window.location.pathname}` : "",
      redirect_uri: endpoints.loginExperience == loginBoxType.Main ?
          `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}${window.location.pathname}` : "",
      response_type: 'code',
      scope: 'openid profile',
      authority: authConfig.authorityUri,
      silent_redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/silent_renew.html`,
      automaticSilentRenew: true,
      filterProtocolClaims: true,
      loadUserInfo: false,
      metadata: {
        authorization_endpoint: authConfig.authorizationUri,
        token_endpoint: authConfig.accessTokenUri
      }
    } : null;
    
    // Enable next two lines to get detailed console logging for oidc-client library
    //Log.logger = console;
    //Log.level = Log.DEBUG;
    this.userManager = this.userManagerConfig ? new UserManager(this.userManagerConfig) : null;

    if (this.userManager) {
      if (window.location.href.indexOf("?code=") != -1 ) {
        this.userManager.signinRedirectCallback(window.location.href)
          .then(
            (user) => {
              this.setToken(user);
              this.oarservice.sendMessage(user);

            }
          )
          .catch( (e) => {alert(e);});
      }
    }
  }


  login(userName: string, password: string) {
    const encodedUser = btoa(userName + ":" + password);

    this.authUrl = this.scservice.getBaseUrl() + endpoints.API + endpoints.AUTH;

    let authParams = new HttpParams();
    let authHeaders = new HttpHeaders();
    authHeaders = authHeaders.append('Authorization', 'Basic ' + encodedUser);

    sessionStorage.setItem("userName", userName);
    sessionStorage.setItem("encodedUser", encodedUser);


    return this.http.get(this.authUrl + "/",
      { observe: 'response', params: authParams, headers: authHeaders});     

  }

  loginOauth(clientID: string) {


    this.scservice.getServerConfig().then(() => {
      this.initConfig();

      this.userManagerConfig.client_id = clientID;
      this.userManager.signinRedirect();

    });
    


  }

  verifyHasTokenOauth() {

  }


  setToken(token: any) {
    const authToken = token.token_type + " " + token.access_token;
    sessionStorage.setItem("oauthUser", authToken);
    return authToken;
  }

  logoutOuath() {
    sessionStorage.removeItem("oauthUser");

    if (this.userManagerConfig) {
      this.userManagerConfig
        .getUser()
          .then( (user) => {
          if( user ) {
            this.userManager.removeUser(user);
            if( user.access_token ) {
              // Remove the token if Pega supports that for public clients (see commented out code lower in method)
              // Could either just let the access token expire or could revoke
              // If revoking, the authorization header for the revoke endpoint should be client_id:client_secret
              // Now need to invoke endpoints to kill tokens (if we ever get a refresh token...would need to kill it as well)
              // Tried passing in regular bearer token--didnt' work
              // Pega Infinity 8.5 is not presently supporting revoking "Public" tokens via the POST /revoke endpoint...so
              //  don't configure a remove endpoing
  /*          
              return axios
                .post(oAuthConfig.revoke,
                {
                  token: accessTkn
                },
                {
                  headers: {
                    'Authorization': 'Basic ' + btoa(oAuthConfig.client_id + ':')
                  }
                })
                .then( (response) => {
                  return Promise.resolve();
                })
                .catch( (error) => {
                  getError(error);
                  // Don't reject the promise (rather treat errors even as success)
                  return Promise.resolve();
                });
  */
            } 
           }

        })
      }


  }



}

