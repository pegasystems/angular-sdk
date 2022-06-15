import { Injectable } from '@angular/core';
import { endpoints,loginBoxType} from './endpoints';
import PegaAuth from '../_helpers/auth';
import { OAuthResponseService } from '../_messages/oauth-response.service';
import { ServerConfigService } from './server-config.service';

declare const PCore;

@Injectable({
  providedIn: 'root'
})



export class AuthService {

  authMgr: any;

  bConfigInitialized: boolean = false;
  bEmbeddedLogin: boolean = sessionStorage.getItem("asdk_embedded") === "1";
  bLoggedIn: boolean = false;
  bUsePopupForRestOfSession: boolean = false;
  gbC11NBootstrapInProgress: boolean = false;

  constructor(private scservice: ServerConfigService,
              private oarservice: OAuthResponseService) { 

    
    this.scservice.getServerConfig().then(() => {
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

  isLoginExpired = () => {
    let bExpired = true;
    const sLoginStart = sessionStorage.getItem("asdk_loggingIn");
    if( sLoginStart !== null ) {
      const currTime = Date.now();
      bExpired = currTime - parseInt(sLoginStart, 10) > 60000;
    }
    return bExpired;
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
    const bLoggingIn:boolean = sessionStorage.getItem("asdk_loggingIn") !== null;
    return bLoggingIn;
  }

  updateLoginStatus = () => {
    this.bLoggedIn = this.getCurrentTokens() !== null;
  };



/**
 * Initiate the process to get the Constellation bootstrap shell loaded and initialized
 * @param {Object} authConfig
 * @param {Object} tokenInfo
 */
constellationInit = (authConfig:any, tokenInfo:any) => {
  /*
  // Safety check (should no longer be necessary)
  const bLoginRedirectCodePage = window.location.href.indexOf("?code") !== -1;
  if( bLoginRedirectCodePage ) {
    return;
  }
  */
  // eslint-disable-next-line sonarjs/prefer-object-literal
  const constellationBootConfig:any = {};
  const sdkConfigServer = this.scservice.getSdkConfigServer();

  // Set up constellationConfig with data that bootstrapWithAuthHeader expects
  // constellationConfig.appAlias = "";
  constellationBootConfig.customRendering = true;
  constellationBootConfig.restServerUrl = sdkConfigServer.infinityRestServerUrl;
  // Removed /constellation/ from sdkContentServerUrl
  constellationBootConfig.staticContentServerUrl = `${sdkConfigServer.sdkContentServerUrl}/constellation/`;
  // NOTE: Needs a trailing slash! So add one if not provided
  if (constellationBootConfig.staticContentServerUrl.slice(-1) !== '/') {
    constellationBootConfig.staticContentServerUrl = `${constellationBootConfig.staticContentServerUrl}/`;
  }
  // If appAlias specified, use it
  if( sdkConfigServer.appAlias ) {
    constellationBootConfig.appAlias = sdkConfigServer.appAlias;
  }

  // Pass in auth info to Constellation
  constellationBootConfig.authInfo = {
    authType: "OAuth2.0",
    tokenInfo,
    // Set whether we want constellation to try to do a full re-Auth or not ()
    // true doesn't seem to be working in SDK scenario so always passing false for now
    popupReauth: false /* !authIsEmbedded() */,
    client_id: authConfig.clientId,
    authentication_service: authConfig.authService,
    redirect_uri: authConfig.redirectUri,
    endPoints: {
        authorize: authConfig.authorizeUri,
        token: authConfig.tokenUri,
        revoke: authConfig.revokeUri
    },
    // TODO: setup callback so we can update own storage
    onTokenRetrieval: this.updateTokens.bind(this)
  }

  // Turn off dynamic load components (should be able to do it here instead of after load?)
  constellationBootConfig.dynamicLoadComponents = false;

  if( this.gbC11NBootstrapInProgress ) {
    return;
  } else {
    this.gbC11NBootstrapInProgress = true;
  }

  // Note that staticContentServerUrl already ends with a slash (see above), so no slash added.
  // In order to have this import succeed and to have it done with the webpackIgnore magic comment tag.  See:  https://webpack.js.org/api/module-methods/
  import(/* webpackIgnore: true */ `${constellationBootConfig.staticContentServerUrl}bootstrap-shell.js`).then((bootstrapShell) => {
    // NOTE: once this callback is done, we lose the ability to access loadMashup.
    //  So, create a reference to it
    window.myLoadMashup = bootstrapShell.loadMashup;

    // For experimentation, save a reference to loadPortal, too!
    window.myLoadPortal = bootstrapShell.loadPortal;

    bootstrapShell.bootstrapWithAuthHeader(constellationBootConfig, 'app-root').then(() => {
      // eslint-disable-next-line no-console
      console.log('Bootstrap successful!');
      this.gbC11NBootstrapInProgress = false;

      PCore.getPubSubUtils().subscribe(PCore.getConstants().PUB_SUB_EVENTS.EVENT_FULL_REAUTH, this.fullReauth.bind(this), "authFullReauth");

      const event = new CustomEvent('ConstellationReady' /*, {detail: {authFullReauth}}*/ );
      document.dispatchEvent(event);
    })
    .catch( e => {
      // Assume error caught is because token is not valid and attempt a full reauth
      // eslint-disable-next-line no-console
      console.error(`Constellation JS Engine bootstrap failed. ${e}`);
      this.gbC11NBootstrapInProgress = false;
      this.fullReauth();
      /*
      if( this.isLoginInProgress() ) {
        // This flag should be reset prior to invoking constellationInit
        console.log(`Login in progress just prior to fullReauth....so abandoning full reauth.`);
      } else {
//        this.fullReauth();
       console.log(`Login not in progress so would have been invoking full reAuth. loginRedirectCodePage: ${bLoginRedirectCodePage}`);
      }
      */
    })
  })
  .catch( e => {
    console.error(`Failed to import bootsratp-shell.js. ${e}`);
  });
  /* Ends here */
};
  
  
  fireTokenAvailable = (token, bLoadC11N=true) => {

    if( !token ) {
      // This is used on page reload to load the token from sessionStorage and carry on
      token = this.getCurrentTokens();
    }
  
    this.updateLoginStatus();
  
    // bLoggedIn is getting updated in updateLoginStatus
    this.bLoggedIn = true;
    this.forcePopupForReauths(true);

    const sSI = sessionStorage.getItem("asdk_CI");
    let authConfig = null;
    if( sSI !== null ) {
      try {
          authConfig = JSON.parse(sSI);
      } catch(e) {
        // do nothing
      }
    }

    // Fire event which indicates the token has changed
    this.oarservice.sendMessage(token);

    // Was firing an event to boot constellation, but thinking might be better to just do that here.
    /*
    // Create and dispatch the SdkLoggedIn event to trigger constellationInit
    const event = new CustomEvent('SdkLoggedIn', { detail: { authConfig, tokenInfo: token } });
    document.dispatchEvent(event);
    */
    // Code that sets up use of Constellation once it's been loaded and ready
    if( !window.PCore && bLoadC11N ) {
      this.constellationInit( authConfig, token );
    }

  };


  updateTokens = (token) => {
    sessionStorage.setItem("asdk_TI", JSON.stringify(token));  
    const authToken = token.token_type + " " + token.access_token;
    sessionStorage.setItem("authHdr", authToken);
    sessionStorage.removeItem("asdk_loggingIn");
    //console.log("updateTokens(tkn): clearing loggingIn");
    this.updateLoginStatus();
  }
  

  processTokenOnLogin = ( token, bLoadC11N=true ) => {
    this.updateTokens(token);
    if( window.PCore ) {
      window.PCore.getAuthUtils().setTokens(token);
    } else {
      this.fireTokenAvailable(token, bLoadC11N );
    }
  };

  updateRedirectUri = (sRedirectUri) => {
    const sSI = sessionStorage.getItem("asdk_CI");
    let authConfig = null;
    if( sSI !== null ) {
      try {
          authConfig = JSON.parse(sSI);
      } catch(e) {
        // do nothing
      }
    }
    authConfig.redirectUri = sRedirectUri;
    sessionStorage.setItem("asdk_CI", JSON.stringify(authConfig));
    this.authMgr.reloadConfig();
  }

  authRedirectCallback = ( href, fnLoggedInCB=null ) => {
    // Get code from href and swap for token
    const aHrefParts = href.split('?');
    const urlParams = new URLSearchParams(aHrefParts.length>1 ? `?${aHrefParts[1]}` : '');
    const code = urlParams.get("code");
  
    this.authMgr.getToken(code).then( token => {
      if( token && token.access_token ) {
        this.processTokenOnLogin(token, false);
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
    sessionStorage.removeItem("authHdr");
    sessionStorage.removeItem("asdk_loggingIn");
    //console.log("clearAuthMgr(): clearing loggingIn")
    this.bLoggedIn = false;
    this.forcePopupForReauths(bFullReauth);
    // Not removing the authMgr structure itself...as it can be leveraged on next login
  };

  authIsEmbedded = () => {
    return sessionStorage.getItem("asdk_embedded") === "1";
  };  

  initAuthMgr = (bInit) => {
    const sdkConfigAuth = this.scservice.getSdkConfigAuth();
    const sdkConfigServer = this.scservice.getSdkConfigServer();
    const pegaUrl = sdkConfigServer.infinityRestServerUrl;
    const currPath = location.pathname;
  
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
    if( sdkConfigServer.appAlias ) {
      authConfig.appAlias = sdkConfigServer.appAlias;
    }
    if( 'silentTimeout' in sdkConfigAuth ) {
      authConfig.silentTimeout = sdkConfigAuth.silentTimeout;
    }
    if( this.bEmbeddedLogin ) {
      authConfig.userIdentifier = sdkConfigAuth.mashupUserIdentifier;
      authConfig.password = sdkConfigAuth.mashupPassword;
    }
    if( 'iframeLoginUI' in sdkConfigAuth ){
      authConfig.iframeLoginUI = sdkConfigAuth.iframeLoginUI.toString().toLowerCase() === 'true';
    }
  
    // Check if sessionStorage exists (and if so if for same authorize endpoint).  Otherwise, assume
    //  sessionStorage is out of date (user just edited endpoints).  Else, logout required to clear
    //  sessionStorage and get other endpoints updates.
    // Doing this as sessionIndex might have been added to this storage structure
    let sSI = sessionStorage.getItem("asdk_CI");
    if( sSI !== null ) {
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

    this.bConfigInitialized = true;
  };


  // TODO: See if we still need such a solution to keep trying for stuff to be loaded
  // Was needed when we were trying to invoke this as source file loaded (before SdkConfigAccessReady event)
  getAuthMgr = ( bInit ) => {
    return new Promise( (resolve) => {
      let idNextCheck = null;
      const fnCheckForAuthMgr = () => {
        if( PegaAuth && !this.authMgr ) {
          this.initAuthMgr( bInit );
        }
        if(this.authMgr) {
          if( idNextCheck ) {
            clearInterval(idNextCheck);
          }
          return resolve(this.authMgr);
        }
      }
      idNextCheck = setInterval(fnCheckForAuthMgr, 500);
    });
  };


  login = (bFullReauth:boolean=false) => {

    this.scservice.getServerConfig().then(() => {
      // Needed so a redirect to login screen and back will know we are still in process of logging in
      sessionStorage.setItem("asdk_loggingIn", `${Date.now()}`);
      //console.log("loggingIn: setting time");

      this.getAuthMgr(!bFullReauth).then( (aMgr:any) => {
        // aMgr will always be same as this.authMgr
        const bPortalLogin = !this.authIsEmbedded();

        if( bPortalLogin && !bFullReauth ) {
          // update redirect uri to be the root
          this.updateRedirectUri(`${window.location.origin}${window.location.pathname}`);
          this.authMgr.loginRedirect();
          // Don't have token til after the redirect
          return Promise.resolve(undefined);
        } else {
          this.updateRedirectUri(`${window.location.origin}/auth.html`);
          return new Promise( (resolve, reject) => {
            this.authMgr.login().then(token => {
              this.processTokenOnLogin(token, true);
              resolve(token.access_token);
            }).catch( (e) => {
              sessionStorage.removeItem("asdk_loggingIn");
              //console.log("login(): clearing loggingIn SS")
              // eslint-disable-next-line no-console
              console.error(`Error caught during login: ${e}`);
              reject(e);
            });
          });
        }
      });

    });
      
  };


  /**
   * Silent or visible login based on login status
   */
  loginIfNecessary = (appName, isEmbedded:boolean=false, deferLogin=false) => {
    // If embedded status of page changed...clearAuthMgr
    const currEmbedded = this.authIsEmbedded();
    const currAppName = sessionStorage.getItem("asdk_appName");
    if( appName !== currAppName || isEmbedded !== currEmbedded) {
      this.clearAuthMgr();
      sessionStorage.setItem("asdk_appName", appName);
    }
    this.setIsEmbedded(isEmbedded);

    // If this is the login redirect with auth code
    if( window.location.href.indexOf("?code") !== -1 ) {
      // initialize authMgr
      this.initAuthMgr(false);
      sessionStorage.removeItem("asdk_loggingIn");
      //console.log("loginIfNecessary: clearing loggingIn");
      this.authRedirectCallback(window.location.href, ()=> {
        //sessionStorage.removeItem("asdk_loggingIn");
        console.log("loginIfNecessary: clearing loggingIn (commented out)");
        window.location.href = window.location.pathname;
      });
      return;
    }
    // If not login redirect with auth code
    if( !deferLogin && (!this.isLoginInProgress() || this.isLoginExpired()) ) {
      this.getAuthMgr(false).then(() => {
       this.updateLoginStatus();
        if( this.bLoggedIn ) {
          this.fireTokenAvailable(this.getCurrentTokens());
        } else {
          return this.login();
        }  
      })
    }
  };


  fullReauth = () => {
    const bHandleHere = true; // Other alternative is to raise an event and have someone else handle it

    if( bHandleHere ) {
      // Don't want to do a full clear of authMgr as will loose sessionIndex.  Rather just clear the tokens
      this.clearAuthMgr(true);
      this.login(true);
    } else {
      // Create and dispatch the SdkLoggedIn event to trigger constellationInit
      // detail will be callback function to call once a new token structure is obtained
      const event = new CustomEvent('SdkFullReauth', { detail: this.processTokenOnLogin.bind(this) });
      document.dispatchEvent(event);
    }
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

