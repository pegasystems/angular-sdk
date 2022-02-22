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

  bConfigInitialized: boolean = false;
  bEmbeddedLogin: boolean = sessionStorage.getItem("asdk_embedded") === "1";
  bLoggedIn: boolean = false;
  bLoginInProgress: boolean = sessionStorage.getItem("asdk_loggingIn") === "1";
  bUsePopupForRestOfSession: boolean = false;
  bC11NInitialized: boolean = false;


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
        this.bUsePopupForRestOfSession = true;
    } else {
        sessionStorage.removeItem("asdk_popup");
        this.bUsePopupForRestOfSession = false;
    }
  };

  setIsEmbedded = ( bEmbedded ) => {
    if( bEmbedded ) {
      this.forcePopupForReauths(true);
      sessionStorage.setItem("asdk_embedded", "1");
      this.bEmbeddedLogin = true;
    } else {
      sessionStorage.removeItem("asdk_embedded");
      this.bEmbeddedLogin = false;
    }
  };

  getCurrentTokens = () => {
    let tokens = null;
    const sTI = sessionStorage.getItem('asdk_TI');
    if( sTI !== null ) {
      try {
        tokens = JSON.parse(sTI);
      } catch(e) {
        tokens = null;
      }  
    }
    return tokens;
  };

  isLoginInProgress = () => {
    return this.bLoginInProgress;
  }

  updateLoginStatus = () => {
    this.bLoggedIn = this.getCurrentTokens() !== null;
  };
  
  
  fireTokenAvailable = (token, bFire=true) => {

    const fnAuthTokenUpdated = ( tokenInfo ) => {
      sessionStorage.setItem("asdk_TI", JSON.stringify(tokenInfo));
      console.log("Setting TI:" + JSON.stringify(tokenInfo));
    };

    const fnAuthFullReauth = () => {
      // Don't want to do a full clear of authMgr as will loose sessionIndex.  Rather just clear the tokens
      this.clearAuthMgr(true);
      this.login();
    };

    if( !token ) {
      // This is used on page reload to load the token from sessionStorage and carry on
      token = this.getCurrentTokens();
    }
    this.setAuthHdr(token);
  
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

    // Fire event which indicates the token has changed
    if( bFire ) {
        this.oarservice.sendMessage(token);
    }

    // Was firing an event to boot constellation, but thinking might be better to just do that here.
    /*
    // Create and dispatch the SdkLoggedIn event to trigger constellationInit
    const event = new CustomEvent('SdkLoggedIn', { detail: { authConfig, tokenInfo: token } });
    document.dispatchEvent(event);
    */
    // Code that sets up use of Constellation once it's been loaded and ready
    if( !this.bC11NInitialized ) {
      constellationInit(this.scservice, authConfig, token, fnAuthTokenUpdated, fnAuthFullReauth );
      this.bC11NInitialized = true;
    }

  };
  

  processTokenOnLogin = ( token ) => {
    sessionStorage.setItem("asdk_TI", JSON.stringify(token));
    if( window.PCore ) {
      window.PCore.getAuthUtils().setTokens(token);
    } else {
      this.fireTokenAvailable(token, false);
    }
  };
  
  // Adjust client id and redirectUri based on embedded an popup login status
  adjustConfigInfo = () => {
    const sdkConfigAuth = this.scservice.getSdkConfigAuth();
    const sSI = sessionStorage.getItem("rsdk_CI");
    let authConfig = null;
    if( sSI != null ) {
      try {
          authConfig = JSON.parse(sSI);
      } catch(e) {
        // do nothing
      }
    }
    authConfig.clientId = this.bEmbeddedLogin ? sdkConfigAuth.mashupClientId : sdkConfigAuth.portalClientId,
    authConfig.redirectUri = this.bEmbeddedLogin || this.bUsePopupForRestOfSession || endpoints.loginExperience === loginBoxType.Popup ?
      `${window.location.origin}/auth.html` : `${window.location.origin}${window.location.pathname}`;
    sessionStorage.setItem("rsdk_CI", JSON.stringify(authConfig));
    this.authMgr.reloadConfig();
  }

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
    // const bPortalLogin = currPath.includes("/portal");
    // const bEmbeddedLogin = currPath.includes("/embedded");
  
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
      clientId: this.bEmbeddedLogin ? sdkConfigAuth.mashupClientId : sdkConfigAuth.portalClientId,
      authorizeUri: sdkConfigAuth.authorize,
      tokenUri: sdkConfigAuth.token,
      revokeUri: sdkConfigAuth.revoke,
      redirectUri: this.bEmbeddedLogin || this.bUsePopupForRestOfSession || endpoints.loginExperience === loginBoxType.Popup ?
        `${window.location.origin}/auth.html` : `${window.location.origin}${window.location.pathname}`,
      authService: sdkConfigAuth.authService,
      useLocking: true
    };
    if( 'silentTimeout' in sdkConfigAuth ) {
      authConfig.silentTimeout = sdkConfigAuth.silentTimeout;
    }
    if( this.bEmbeddedLogin ) {
      authConfig.userIdentifier = sdkConfigAuth.mashupUserIdentifier;
      authConfig.password = sdkConfigAuth.mashupPassword;
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
        // Already would be fired in authRedirectCallback
        //this.fireTokenAvailable(token, false);
        location.href = location.pathname;
      });
    }

    this.bConfigInitialized = true;
  };


  login = () => {

    this.scservice.getServerConfig().then(() => {
      this.initConfig(true);

      this.bLoginInProgress = true;
      // Needed so a redirect to login screen and back will know we are still in process of logging in
      sessionStorage.setItem("asdk_loggingIn", "1");

      if( this.bUsePopupForRestOfSession ) {
        //this.adjustConfigInfo();
        return new Promise( (resolve, reject) => {
          this.authMgr.login().then(token => {
            this.bLoginInProgress = false;
            this.processTokenOnLogin(token);
            resolve(token.access_token);
          }).catch( (e) => {
            this.bLoginInProgress = false;
            sessionStorage.removeItem("asdk_loggingIn");
            // eslint-disable-next-line no-console
            console.log(e);
            reject(e);
          });
        });
      } else {
        //this.adjustConfigInfo();
        this.authMgr.loginRedirect();
      }
    });
    
  };


  /**
   * Silent or visible login based on login status
   */
  loginIfNecessary = (bEmbedded:boolean=false) => {
    this.setIsEmbedded(bEmbedded);
    if( !this.bLoginInProgress ) {
      this.scservice.getServerConfig().then(() => {
        this.initConfig(false);
        this.updateLoginStatus();
        if( this.bLoggedIn ) {
          this.fireTokenAvailable(null);
        } else {
          return this.login();
        }  
      });  
    }
  };

  setAuthHdr = (token: any) => {
    const authToken = token.token_type + " " + token.access_token;
    sessionStorage.setItem("authHdr", authToken);
    return authToken;
  };

  logout = () => {
    sessionStorage.removeItem("authHdr");
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

  };



}

