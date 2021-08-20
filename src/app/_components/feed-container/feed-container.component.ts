import { Component, OnInit, Input, Inject } from '@angular/core';
import { Utils } from "../../_helpers/utils";
import { AngularPConnectService } from "../../_bridge/angular-pconnect";
import { interval } from "rxjs/internal/observable/interval";
import { ChangeDetectorRef } from "@angular/core";
// import * as moment from "moment";
import * as isEqual from 'fast-deep-equal';
import FeedApi from  './feed-api.js';


@Component({
  selector: 'app-feed-container',
  templateUrl: './feed-container.component.html',
  styleUrls: ['./feed-container.component.scss'],
  providers: [Utils]
})
export class FeedContainerComponent implements OnInit {

  @Input() pConn$: any;

  userName$: string;
  imageKey$: string;

  currentUserInitials$: string;
  currentUserName$: string;

  pulseMessages$: Array<any>;
  showReplyComment$: Object = {};

  svgComment$ : string;
  svgLike$: string;
  svgLikedByMe$: string;
  svgSend$: string;

  
  pulseConversation: string;
  userData: Map<any, any> = new Map();

  pulseComment: Object = {};


  // functions
  actionsAPI: any;
  // until FeedAPI moved back to PCore, we access the methods directly (see ngInit)
  // feedAPI: any;

  pulseData: any;

  // Temporary way to use FeedApi...
  fetchMessages: any;
  likeMessage: any;
  postMessage: any;


  // Used with AngularPConnect
  angularPConnectData: any = {};

  PCore$: any;

  constructor(private angularPConnect: AngularPConnectService, 
              private cdRef: ChangeDetectorRef,
              private utils: Utils) { 

  }

  ngOnInit(): void {

    if (!this.PCore$) {
      this.PCore$ = window.PCore;
    }

    this.userName$ = this.PCore$.getEnvironmentInfo().getOperatorName();
    this.imageKey$ = this.PCore$.getEnvironmentInfo().getOperatorImageInsKey();
    this.updateCurrentUserName(this.userName$);

    // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);
    
    // Then, continue on with other initialization
    // debugger;

    // const {
    //   fetchMessages,
    //   likeMessage,
    //   postMessage
    // } = FeedApi(this.pConn$);
    // this.fetchMessages = fetchMessages;
    // this.likeMessage = likeMessage;
    // this.postMessage = postMessage;

    // // this.userName$ = this.pConn$.getValue("pxRequestor.pxUserName");
    // // this.imageKey$ = this.pConn$.getValue("OperatorID.pyImageInsKey");

    // //this.userName$ = this.pConn$.getDataObject()["D_pxEnvironmentInfo"].pxOperator.pyUserName;
    // //this.imageKey$ = this.pConn$.getDataObject()["D_pxEnvironmentInfo"].pxOperator.pyImageInsKey;
    // this.userName$ = this.pConn$.getEnvironmentInfo().getOperatorName();
    // this.imageKey$ = this.pConn$.getEnvironmentInfo().getOperatorImageInsKey();

   

    // this.actionsAPI = this.pConn$.getActionsApi();

    // let owner = this.pConn$.getConfigProps().value;

    // // with new FeedAPI: owner is the proper value to pass in
    // //  and no longer takes 2nd argument
    // this./*feedAPI.*/fetchMessages(owner /*, this.pConn$.getContextName()*/);



    let configProps = this.pConn$.getConfigProps();

    const { messageIDs } = configProps;

    const {
      fetchMessages,
      postMessage,
      getMentionSuggestions,
      getTagSuggestions
    } = FeedApi(this.pConn$);

    const appName = this.PCore$.getEnvironmentInfo().getApplicationName();
    let value = "";
    let feedID = "";
    let feedClass = "";

    if (this.pConn$.getCaseSummary().ID) {
      value = this.pConn$.getCaseSummary().ID;
      feedID = "pyCaseFeed";
      feedClass = this.pConn$.getCaseSummary().content.classID;
    } else {
      value = `DATA-PORTAL $${appName}`;
      feedID = "pyDashboardFeed";
      feedClass = "@baseclass";
    }

    const onUploadProgress = () => {};
    const errorHandler = () => {};
    const attachments  = () => {};


    const postComment = ({ value: message, clear }) => {
      const attachmentIDs = [];
      const attachmentUtils = this.PCore$.getAttachmentUtils();
      if (attachments && !!attachments.length) {
        attachments /*
          .filter((file) => !file.error)
          .map((file) => {
            return attachmentUtils
              .uploadAttachment(file, onUploadProgress, errorHandler)
              .then((fileResponse) => {
                const fileConfig = {
                  type: "File",
                  category: "File",
                  fileName: file.name,
                  ID: fileResponse.data.ID
                };
                attachmentIDs.push(fileConfig);
                if (attachments.length === attachmentIDs.length) {
                  postMessage(
                    value,
                    transformMarkdownToMsg(message),
                    attachmentIDs
                  );
                  clear();
                  setAttachments([]);
                }
              })
  
              .catch(console.error);
          }); */
      } else {
        //postMessage(value, transformMarkdownToMsg(message));
        clear();
      }
    };



    /*

    const { getPConnect, messageIDs } = props;
    const [mentionResults, setMentionResults] = useState([]);
    const [tagResults, setTagResults] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [feedFilters, setFeedFilters] = useState();
    const {
      fetchMessages,
      postMessage,
      getMentionSuggestions,
      getTagSuggestions
    } = FeedApi(getPConnect());
    const appName = PCore.getEnvironmentInfo().getApplicationName();
    let value = "";
    let feedID = "";
    let feedClass = "";
    if (getPConnect().getCaseSummary().ID) {
      value = getPConnect().getCaseSummary().ID;
      feedID = "pyCaseFeed";
      feedClass = getPConnect().getCaseSummary().content.classID;
    } else {
      value = `DATA-PORTAL $${appName}`;
      feedID = "pyDashboardFeed";
      feedClass = "@baseclass";
    }
    // For cancelling fetchrequest for filetrs
    const fetchMessagesCancelTokenSource = useRef([]);
  
    useEffect(() => {
      fetchMessages(
        value,
        feedID,
        feedClass,
        null,
        fetchMessagesCancelTokenSource.current
      ).then((res) => {
        setFeedFilters(res);
      });
      PCore.getAssetLoader().getLoader("component-loader")(["Activity"]);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
    const onUploadProgress = useCallback((file) => {
      return ({ loaded, total }) => {
        file.progress = Math.floor((loaded / total) * 100);
        setAttachments((current) => {
          return current.map((currFile) => {
            return currFile.name === file.name ? file : currFile;
          });
        });
      };
    }, []);
  
    const errorHandler = useCallback((isFetchCanceled, file) => {
      return (error) => {
        if (!isFetchCanceled(error)) {
          let localizedValue = "Upload failed";
          if (
            error.response &&
            error.response.data &&
            error.response.data.errorDetails
          ) {
            localizedValue = error.response.data.errorDetails[0].localizedValue;
          }
          delete file.progress;
          setAttachments((current) => {
            return current.map((currFile) => {
              if (currFile.name === file.name) {
                currFile.meta = localizedValue;
                currFile.error = true;
              }
              return currFile;
            });
          });
          error.isHandled = true;
        }
        throw error;
      };
    }, []);
  
    const postComment = ({ value: message, clear }) => {
      const attachmentIDs = [];
      const attachmentUtils = window.PCore.getAttachmentUtils();
      if (attachments && !!attachments.length) {
        attachments
          .filter((file) => !file.error)
          .map((file) => {
            return attachmentUtils
              .uploadAttachment(file, onUploadProgress, errorHandler)
              .then((fileResponse) => {
                const fileConfig = {
                  type: "File",
                  category: "File",
                  fileName: file.name,
                  ID: fileResponse.data.ID
                };
                attachmentIDs.push(fileConfig);
                if (attachments.length === attachmentIDs.length) {
                  postMessage(
                    value,
                    transformMarkdownToMsg(message),
                    attachmentIDs
                  );
                  clear();
                  setAttachments([]);
                }
              })
  
              .catch(console.error);
          });
      } else {
        postMessage(value, transformMarkdownToMsg(message));
        clear();
      }
    };

    */
  
    /* On search is called when @ character is entered and will display the mention */

    /*
    const onSearch = debounce((event) => {
      if (event.type === "mention") {
        getMentionSuggestions({
          pulseContext: value,
          searchFor: event.search
        }).then((res) => {
          setMentionResults(res);
        });
      } else {
        getTagSuggestions({
          searchFor: event.search
        }).then((res) => {
          setTagResults(res);
        });
      }
    }, 150);
  
    const userName = getPConnect().getEnvironmentInfo().getOperatorName();
    const imageKey = getPConnect().getEnvironmentInfo().getOperatorImageInsKey();
  
    const onFilesAdded = useCallback((newlyAddedFiles) => {
      setAttachments((current) => [
        ...newlyAddedFiles.map((file) => {
          if (!validateMaxSize(file, 5)) {
            file.error = true;
            file.meta = "File is too big. Max allowed size is 5MB.";
          }
          file.icon = getIconFromFileType(file.type);
          file.onDelete = () => {
            setAttachments((c) => c.filter((f) => f.name !== file.name));
          };
          return file;
        }),
        ...current
      ]);
    }, []);
  
    const onFilterChange = useCallback(
      (filterID) => {
        const updatedFilters = [...feedFilters];
        const filterToUpdate = updatedFilters.find(
          (feedItem) => feedItem.id === filterID
        );
        filterToUpdate.on = !filterToUpdate.on;
        if (filterID === "All")
          updatedFilters.forEach((feedFilter) => {
            feedFilter.on = filterToUpdate.on;
          });
        else if (
          updatedFilters.find(
            (feedItem) => feedItem.on === false && feedItem.id !== "All"
          )
        )
          updatedFilters.find((feedItem) => feedItem.id === "All").on = false;
        else updatedFilters.find((feedItem) => feedItem.id === "All").on = true;
        setFeedFilters(updatedFilters);
        fetchMessages(
          value,
          feedID,
          feedClass,
          feedFilters,
          fetchMessagesCancelTokenSource.current
        );
      },
      [
        value,
        feedID,
        feedClass,
        feedFilters,
        fetchMessagesCancelTokenSource,
        fetchMessages
      ]
    );

    */





    // set up svg images
    this.svgComment$ = this.utils.getImageSrc("chat", this.PCore$.getAssetLoader().getStaticServerUrl());
    this.svgLike$ = this.utils.getImageSrc("thumbs-up", this.PCore$.getAssetLoader().getStaticServerUrl());
    this.svgLikedByMe$ = this.utils.getImageSrc("thumbs-up-solid", this.PCore$.getAssetLoader().getStaticServerUrl());
    this.svgSend$ = this.utils.getImageSrc("send", this.PCore$.getAssetLoader().getStaticServerUrl());

  }


  ngOnDestroy(): void {
    if (this.angularPConnectData.unsubscribeFn) {
      //console.log( `${this.constructor.name} - ${this.angularPConnectData.compID} - unsubscribing from Store`);
      this.angularPConnectData.unsubscribeFn();
    }
  }  



  // Callback passed when subscribing to store change
  onStateChange() {
    const bLogging = false;
    if (bLogging) {
      //console.log( `in ${this.constructor.name} onStateChange` );
      // debugger;
    }
    // Should always check the bridge to see if the component should update itself (re-render)
    const bUpdateSelf = this.angularPConnect.shouldComponentUpdate( this );
    // console.log( `${this.constructor.name} shouldComponentUpdate: ${bUpdateSelf}`);

    // ONLY call updateSelf when the component should update
    //    AND removing the "gate" that was put there since shouldComponentUpdate
    //      should be the real "gate"
    if (bUpdateSelf) {
      this.updateSelf();
    }
    else {
      let newPulseData = this.pConn$.getDataObject().pulse;

        if (!isEqual(newPulseData, this.pulseData)) {
          this.updateSelf();
        }
    }

    this.pulseData = this.pConn$.getDataObject().pulse;


  }


  updateSelf() {

    this.getMessageData();

  }

  getMessageData() {
    let messageIDs = this.pConn$.getConfigProps().messageIDs;
    let userName = this.pConn$.getConfigProps().currentUser;
    let imageKey = this.pConn$.getValue("OperatorID.pyImageInsKey");

    let oData = this.pConn$.getDataObject();


    if (messageIDs && messageIDs.length > 0) {

      this.pulseMessages$ = JSON.parse(JSON.stringify(oData.pulse.messages));

      // convert to just an array of objects
      this.pulseMessages$ = this.convertToArray(this.pulseMessages$);

      // create a copy, so we can modify
      this.pulseMessages$ =  this.appendPulseMessage(this.pulseMessages$);

      // most recent on top
      this.pulseMessages$ = this.pulseMessages$.sort((a,b) => (a.updateTimeUTC < b.updateTimeUTC) ? 1 : -1);

    }

  }

  convertToArray(messages: Array<any>) : Array<any> {
    let arMessages: Array<any> = new Array();

    for (let message in messages) {

      arMessages.push(messages[message]);
    }


    return arMessages;


  }

  appendPulseMessage(messages: Array<any>) : Array<any> {
    for (let i in messages) {
      let message = messages[i];
      let postedTime = message["postedTime"];
      let updatedTime = message["updatedTime"]

      this.showReplyComment$[message.ID] = false;

      // message["displayPostedTime"] = moment(postedTime, "YYYYMMDD[T]HHmmss[.]SSS Z").fromNow();
      message["displayPostedTime"] = this.utils.generateDateTime(postedTime, "DateTime-Since");

      // for sorting lasted update
      if (updatedTime != null) {
        // message["updateTimeUTC"] = parseInt(moment(updatedTime, "YYYYMMDD[T]HHmmss[.]SSS Z").format("x"));
        message["updateTimeUTC"] = new Date(updatedTime).getTime();
      }
      else {
        // message["updateTimeUTC"] = parseInt(moment(postedTime, "YYYYMMDD[T]HHmmss[.]SSS Z").format("x"));
        message["updateTimeUTC"] = new Date(postedTime).getTime();
      }
    


      message["displayPostedBy"] = message.postedByUser.name;
      message["displayPostedByInitials"] = this.utils.getInitials(message.postedByUser.name);


        // if didn't break, the look at the replies
        for (let iR in message.replies) {
        let reply = message.replies[iR];

        let replyPostedTime = reply["postedTime"];
        // reply["displayPostedTime"] = moment(replyPostedTime, "YYYYMMDD[T]HHmmss[.]SSS Z").fromNow();
        reply["displayPostedTime"] = this.utils.generateDateTime(postedTime, "DateTime-Since");


        //let oReplyUser = this.userData.get(reply.postedByUser);
        let oReplyUser = reply.postedByUser;

        if (oReplyUser) {
          reply["displayPostedBy"] = oReplyUser.name;
          reply["displayPostedByInitials"] = this.utils.getInitials(oReplyUser.name);
        }


      }    

    } // for

    return messages;
  }

  updateMessagesWithOperators() {


    for (let i in this.pulseMessages$) {
      let message = this.pulseMessages$[i];

      let postedTime = message["postedTime"];

      this.showReplyComment$[message.ID] = false;

      // message["displayPostedTime"] = moment(postedTime, "YYYYMMDD[T]HHmmss[.]SSS Z").fromNow();
      message["displayPostedTime"] = this.utils.generateDateTime(postedTime, "DateTime-Since");

      
      let oUser = this.userData.get(message.postedBy);

      if (oUser) {
        message["displayPostedBy"] = oUser.pyUserName;
        message["displayPostedByInitials"] = this.utils.getInitials(oUser.pyUserName);

      }
      else {

        let oUserParams = new Object();
        oUserParams["OperatorId"] = message.postedBy;



      }


      // if didn't break, the look at the replies
      for (let iR in message.replies) {
        let reply = message.replies[iR];

        let replyPostedTime = reply["postedTime"];
        // reply["displayPostedTime"] = moment(replyPostedTime, "YYYYMMDD[T]HHmmss[.]SSS Z").fromNow();
        reply["displayPostedTime"] = this.utils.generateDateTime(postedTime, "DateTime-Since");


        //let oReplyUser = this.userData.get(reply.postedByUser);
        let oReplyUser = reply.postedByUser;

        if (oReplyUser) {
          reply["displayPostedBy"] = oReplyUser.name;
          reply["displayPostedByInitials"] = this.utils.getInitials(oReplyUser.name);
        }

      }


    } // for

  }




  updateCurrentUserName(sUser: string) {
    this.currentUserInitials$ = this.utils.getInitials(sUser);
    this.currentUserName$ = sUser;

  }

  postClick() {

    // don't send a blank message
    if (this.pulseConversation && this.pulseConversation != "") {

      // let pulseMessage = { 
      //   contextName : this.pConn$.getContextName(),
      //   message: this.pulseConversation,
      //   pulseContext: this.pConn$.getValue(".pzInsKey")
      // };

      // debugger;
      // used to be: this./*feedAPI.*/postMessage(pulseMessage);
      // With latest FeedAPI, the 1st arg should be getConfigProps().value
      this./*feedAPI.*/postMessage(this.pConn$.getConfigProps().value, this.pulseConversation);

    }

    // clear out local copy
    document.getElementById("pulseMessage")["value"] = "";
    this.pulseConversation = "";
    
  }


  messageChange(event: any) {
    this.pulseConversation = event.target.value;

  }

  likeClick(messageID: string, rMessageID: string,  bLikedByMe: boolean, level: string) {

    let pulseMessage = {};

    if (level === "top") {
      pulseMessage = { 
        pulseContext: rMessageID,
        isReply: null,
        contextName: this.pConn$.getContextName(),
        likedBy: bLikedByMe,
        messageID: messageID
      };
    }
    else {
      pulseMessage = { 
        pulseContext: rMessageID,
        isReply: true,
        contextName: this.pConn$.getContextName(),
        likedBy: bLikedByMe,
        messageID: messageID
      };
    }

    // debugger;
    this./*feedAPI.*/likeMessage(pulseMessage);


  }

  commentClick(messageID) {

    // iterator through messages, find match, turn on comment entry
    for (let i in this.pulseMessages$) {
      if (this.pulseMessages$[i].ID === messageID) {
        this.showReplyComment$[this.pulseMessages$[i].ID] = true;
      }
    }

    this.cdRef.detectChanges();

  }

  

  postCommentClick(messageID) {

    // debugger;
    
    if (this.pulseComment[messageID] && this.pulseComment[messageID] != "") {
      // let pulseMessage = { 
      //   contextName : this.pConn$.getContextName(),
      //   message: this.pulseComment[messageID],
      //   pulseContext: messageID,
      //   reply: true
      // };

      // debugger;
      // Used to be: this./*feedAPI.*/postMessage(pulseMessage);
      //  Latest update to API has changed and the postMessage actually gets
      //  the pulse context...
      // used to use: contextName
      // new FeedAPI wants args to be messageID, this.pulseComment[messageID], true (since this is a reply)
      this./*feedAPI.*/postMessage(messageID, this.pulseComment[messageID], true);

      this.pulseComment[messageID] = "";
    }

  }

  newCommentChange(event, messageID) {
    this.pulseComment[messageID] = event.target.value;
  }


}