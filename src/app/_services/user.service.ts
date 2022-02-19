import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { endpoints,loginBoxType} from './endpoints';
import PegaAuth from '../_helpers/auth';
import { constellationInit } from '../_helpers/c11nboot';
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

  authMgr: any;

  bInit: boolean = false;
  bLoggedIn: boolean = false;
  bLoginInProgress: boolean = false;
  usePopupForRestOfSession: boolean = false;


  constructor(private http: HttpClient,
              private scservice: ServerConfigService,
              private oarservice: OAuthResponseService) { 

    
    this.scservice.getServerConfig().then(() => {
      this.initConfig(false);
    });
  };

  /*
  * Set to use popup experience for rest of session
  */
  forcePopupForReauths = ( bForce ) => {
    if( bForce ) {
        sessionStorage.setItem("asdk_popup", "1");
        this.usePopupForRestOfSession = true;
    } else {
        sessionStorage.removeItem("asdk_popup");
        this.usePopupForRestOfSession = false;
    }
  };

  getCurrentTokens = () => {
    let tokens = null;
    const sTI = sessionStorage.getItem('asdk_TI');
    if(!sTI) return;
    try {
      tokens = JSON.parse(sTI);
    } catch(e) {
      tokens = null;
    }
    return tokens;
  };

  updateLoginStatus = () => {
    this.bLoggedIn = this.getCurrentTokens() !== null;
  };
  
  
  fireTokenAvailable = (token) => {

    const fnAuthTokenUpdated = ( tokenInfo ) => {
      sessionStorage.setItem("asdk_TI", JSON.stringify(tokenInfo));
    };

    const fnAuthFullReauth = () => {
      this.clearAuthMgr(true);
      this.loginOauth(true);
    };

    if( !token ) {
      // This is used on page reload to load the token from sessionStorage and carry on
      token = this.getCurrentTokens();
    }
    this.setToken(token);
  
    this.updateLoginStatus();
  
    // bLoggedIn is getting updated in updateLoginStatus
    this.bLoggedIn = true;
    this.bLoginInProgress = false;
    sessionStorage.removeItem("asdk_loggingIn");
    this.forcePopupForReauths(true);
  
    const sSI = sessionStorage.getItem("asdk_CI");
    let authConfig = null;
    if( sSI ) {
      try {
          authConfig = JSON.parse(sSI);
      } catch(e) {
        // do nothing
      }
    }

    // Was firing an event to boot constellation, but thinking might be better to just do that here.
    /*
    // Create and dispatch the SdkLoggedIn event to trigger constellationInit
    const event = new CustomEvent('SdkLoggedIn', { detail: { authConfig, tokenInfo: token } });
    document.dispatchEvent(event);
    */

    constellationInit(this.scservice, authConfig, token, fnAuthTokenUpdated, fnAuthFullReauth );

    this.oarservice.sendMessage(token);

  };
  

  processTokenOnLogin = ( token ) => {
    sessionStorage.setItem("asdk_TI", JSON.stringify(token));
    if( window.PCore ) {
      window.PCore.getAuthUtils().setTokens(token);
    } else {
      this.fireTokenAvailable(token);
    }
  };
  


  authRedirectCallback = ( href, fnLoggedInCB=null ) => {
    // Get code from href and swap for token
    const aHrefParts = href.split('?');
    const urlParams = new URLSearchParams(aHrefParts.length>1 ? `?${aHrefParts[1]}` : '');
    const code = urlParams.get("code");
  
    this.authMgr.getToken(code).then( token => {
      if( token && token.access_token ) {
        this.processTokenOnLogin(token);
        if( fnLoggedInCB ) {
            fnLoggedInCB( token );
        }
      }
    });  
  };

  /**
   * Clean up any web storage allocated for the user session.
   */
  clearAuthMgr = (bFullReauth=false) => {
    // Remove any local storage for the user
    if( !bFullReauth ) {
      sessionStorage.removeItem("asdk_CI");
    }
    sessionStorage.removeItem("asdk_TI");
    sessionStorage.removeItem("asdk_loggingIn");
    this.bLoggedIn = false;
    this.bLoginInProgress = false;
    this.forcePopupForReauths(bFullReauth);
    // Not removing the authMgr structure itself...as it can be leveraged on next login
  };

  

  initConfig = (bInit) => {
    const sdkConfigAuth = this.scservice.getSdkConfigAuth();
    //const authConfig = this.scservice.getSdkConfigAuth();
    const pegaUrl = this.scservice.getSdkConfigServer().infinityRestServerUrl;
    const currPath = location.pathname;
    const bPortalLogin = currPath.includes("/portal");
    const bEmbeddedLogin = currPath.includes("/embedded");
  
    // Construct default OAuth endpoints (if not explicitly specified)
    if (pegaUrl) {
      if (!sdkConfigAuth.authorize) {
        sdkConfigAuth.authorize = `${pegaUrl}/PRRestService/oauth2/v1/authorize`;
      }
      if (!sdkConfigAuth.token) {
        sdkConfigAuth.token = `${pegaUrl}/PRRestService/oauth2/v1/token`;
      }
      if (!sdkConfigAuth.revoke) {
        sdkConfigAuth.revoke = `${pegaUrl}/PRRestService/oauth2/v1/revoke`;
      }
    }
    // Auth service alias
    if( !sdkConfigAuth.authService) {
      sdkConfigAuth.authService = "pega";
    }

    const authConfig:any = {
      clientId: bPortalLogin ? sdkConfigAuth.portalClientId : sdkConfigAuth.mashupClientId,
      authorizeUri: sdkConfigAuth.authorize,
      tokenUri: sdkConfigAuth.token,
      revokeUri: sdkConfigAuth.revoke,
      redirectUri: endpoints.loginExperience == loginBoxType.Main ? `${window.location.origin}${window.location.pathname}` : "",
      //redirectUri: `${window.location.origin}/`,
      authService: sdkConfigAuth.authService,
      useLocking: true
    };
    if( 'silentTimeout' in sdkConfigAuth ) {
      authConfig.silentTimeout = sdkConfigAuth.silentTimeout;
    }

    // Check if sessionStorage exists (and if so if for same authorize endpoint).  Otherwise, assume
    //  sessionStorage is out of date (user just edited endpoints).  Else, logout required to clear
    //  sessionStorage and get other endpoints updates.
    // Doing this as sessionIndex might have been added to this storage structure
    let sSI = sessionStorage.getItem("asdk_CI");
    if( sSI ) {
      try {
          const oSI = JSON.parse(sSI);
          if( oSI.authorizeUri !== authConfig.authorizeUri ||
              oSI.clientId !== authConfig.clientId ||
              oSI.userIdentifier !== authConfig.userIdentifier ||
              oSI.password !== authConfig.password) {
              this.clearAuthMgr();
              sSI = null;
          }
      } catch(e) {
        // do nothing
      }
    }

    if( !sSI || bInit ) {
      sessionStorage.setItem('asdk_CI', JSON.stringify(authConfig));
    }
    this.authMgr = new PegaAuth('asdk_CI');

    // Checking for ?code=
    if( this.authMgr && window.location.href.indexOf("?code") !== -1 ) {
      this.authRedirectCallback(window.location.href, (token)=> {
        this.fireTokenAvailable(token);
        location.href = location.pathname;
      });
    }

    /*
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
    */
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

  loginOauth(bFullReauth:boolean) {


    this.scservice.getServerConfig().then(() => {
      this.initConfig(true);

      this.bLoginInProgress = true;
      // Needed so a redirect to login screen and back will know we are still in process of logging in
      sessionStorage.setItem("asdk_loggingIn", "1");

      this.authMgr.loginRedirect();
    
      /*
      getAuthMgr(!bFullReauth).then( (aMgr) => {
        const bPortalLogin = !authIsEmbedded();
    
        // If portal will redirect to main page, otherwise will authorize in a popup window
        if (bPortalLogin && !bFullReauth) {
          // update redirect uri to be the root
          updateRedirectUri(aMgr, `${window.location.origin}/`);
          aMgr.loginRedirect();
          // Don't have token til after the redirect
          return Promise.resolve(undefined);
        } else {
          // Set redirectUri to static auth.html
          updateRedirectUri(aMgr, `${window.location.origin}/auth.html`)
          return new Promise( (resolve, reject) => {
            aMgr.login().then(token => {
                processTokenOnLogin(token);
                resolve(token.access_token);
            }).catch( (e) => {
                gbLoginInProgress = false;
                sessionStorage.removeItem("asdk_loggingIn");
                // eslint-disable-next-line no-console
                console.log(e);
                reject(e);
            })
          });
        }
      });
      */
      //this.userManagerConfig.client_id = clientID;
      //this.userManager.signinRedirect();

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
    const tokenInfo = this.getCurrentTokens();
    if( tokenInfo && tokenInfo.access_token ) {
      if( window.PCore ) {
        window.PCore.getAuthUtils().revokeTokens().then(() => {
            this.clearAuthMgr();
        }).catch(err => {
            // eslint-disable-next-line no-console
            console.log("Error:",err?.message);
        });
      } else {
        this.authMgr.revokeTokens(tokenInfo.access_token, tokenInfo.refresh_token).then(() => {
          this.clearAuthMgr();
        });
      }
    }

  }



}

