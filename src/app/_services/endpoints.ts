// OAuth login box type (only recent testing with Main)
export const loginBoxType = {
  Main: 1,
  Popup: 2,
  Modal: 3
};

export const endpoints = {
    // Change this URL if you want to point the React application at another Pega server.
    // local
    //BASEURL: "http://localhost:1080/prweb/api",
    //BASEURL: "https://localhost:1080/prweb/api",
    // 85
    //BASEURL: "https://lu-85-cam.eng.pega.com/prweb/api",

    loginExperience: loginBoxType.Main,

    // OAUTHCFG: {
    //   providerID: "pega",
    //   authorization: "https://localhost:1080/prweb/PRRestService/oauth2/v1/authorize",
    //   authority: "https://localhost:1080/prweb/PRRestService/oauth2/v1",
    //   token: "https://localhost:1080/prweb/PRRestService/oauth2/v1/token",
    //   scope: [],
    //   // for mashup MediaCo login customer, otherwise, regular login pass in client id
    //   client_id: "12595401538569726922",
    //   client_secret:  "CC374FD41B4F0726C7F2A4DD8CE1E991",
    //   grant_type:  "client_credentials",
    //   // main window login
    //   use_pkce: true,
    //   loginExperience: loginBoxType.Main
    // },

    SP_VERSION: "1.00",

    AUTH: "/v1/authenticate",
    CASES: "/v1/cases",
    CASES_V2: "/application/v2/cases",
    CASETYPES: "/v1/casetypes",
    CASETYPES_V2: "/application/v2/casetypes",
    CONFIG_V2: "/application/v2/config",
    VIEWS: "/views",
    ASSIGNMENTS: "/v1/assignments",
    ASSIGNMENTS_V2: "/application/v2/assignments",
    ACTIONS: "/actions",
    PAGES: "/pages",
    DATA: "/v1/data",
    DATA_V2: "/application/v2/data",
    REFRESH: "/refresh",
    BACK_V2: "/navigation_steps/previous",
    PULSE: "/v1/messages",
    PULSE_V2: "/v2/messages",
    ROUTING: "mashup",
    MEDIACO: "MediaCo",
    API: "/api",

    EMBEDDED: "embedded",
    EMBEDDEDHTML: "embedded.html",
    MASHUP: "mashup",
    MASHUPHTML: "mashup.html",
    SIMPLEPORTAL: "simpleportal",
    SIMPLEPORTALHTML: "simpleportal.html",
    PORTAL: "portal",
    PORTALHMTL: "portal.html",
    FULLPORTAL: "fullportal",
    FULLPORTALHTML: "fullportal.html"
  };
