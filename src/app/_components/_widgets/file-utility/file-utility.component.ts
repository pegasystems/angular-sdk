import { Component, OnInit, Input, Renderer2 } from '@angular/core';
import { AngularPConnectService } from "../../../_bridge/angular-pconnect";
import { Utils } from "../../../_helpers/utils";
import { NgZone } from '@angular/core';
import download from "downloadjs";

@Component({
  selector: 'app-file-utility',
  templateUrl: './file-utility.component.html',
  styleUrls: ['./file-utility.component.scss']
})
export class FileUtilityComponent implements OnInit {

  @Input() pConn$: any;

  arFullListAttachments: Array<any> = [];

  lu_name$ : string = "";
  lu_icon$: string = "";
  lu_bLoading$: boolean = false;
  lu_count$: number = 0;
  lu_arActions$: Array<any> = [];
  lu_arItems$: any = [];

  va_arItems$: Array<any> = [];

  lu_onViewAllFunction: any;

  bShowFileModal$: boolean = false;
  bShowLinkModal$: boolean = false;
  bShowViewAllModal$: boolean = false;

  arFileMainButtons$: Array<any> = [];
  arFileSecondaryButtons$: Array<any> = [];

  arLinkMainButtons$: Array<any> = [];
  arLinkSecondaryButtons$: Array<any> = [];

  arFiles$: Array<any> = [];
  arFileList$: Array<any> = [];
  removeFileFromList$: any;

  arLinks$: Array<any> = [];
  arLinksList$: Array<any> = [];
  removeLinksFromList$: any;

  link_title$: string = "";
  link_url$: string = "";

  currentLink: string = "";
  currentUrl: string = "";

  closeSvgIcon$: string = "";

  currentCaseID: string = "";



  addAttachmentsActions: Array<any> = [
    {
      text: "Add files",
      id: "addNewFiles",
      onClick: () => this.createModal("addLocalFile")
    },
    {
      text: "Add links",
      id: "addNewLinks",
      onClick: () => this.createModal("addLocalLink")
    }
  ];

  PCore$: any;

  // For interaction with AngularPConnect
  angularPConnectData: any = {};

  constructor(private angularPConnect: AngularPConnectService,
              private utils: Utils,
              private ngZone: NgZone,
              private renderer: Renderer2) { }

  ngOnInit(): void {

    // // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);

    if (!this.PCore$) {
      this.PCore$ = window.PCore;
    }


    let configProps: any = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());


    this.lu_name$ = configProps.label;
    this.lu_icon$ = "paper-clip";

    this.closeSvgIcon$ = this.utils.getImageSrc("times", this.PCore$.getAssetLoader().getStaticServerUrl());


    let onViewAllCallback = () => this.onViewAll(this.arFullListAttachments);

    this.lu_onViewAllFunction = { onClick: this.onViewAll.bind(this) }

    this.removeFileFromList$ = { onClick: this.removeFileFromList.bind(this) }
    this.removeLinksFromList$ = { onClick: this.removeLinksFromList.bind(this) }

    this.updateSelf();

    this.createModalButtons();


}



  ngOnDestroy(): void {

    if (this.angularPConnectData.unsubscribeFn) {
      this.angularPConnectData.unsubscribeFn();
    }

  }

  // Callback passed when subscribing to store change
  onStateChange() {
    // adding a property to track in configProps, when ever the attachment file changes
    // need to trigger a redraw
    this.pConn$.registerAdditionalProps({
      lastRefreshTime: `@P ${
        this.PCore$.getConstants().SUMMARY_OF_ATTACHMENTS_LAST_REFRESH_TIME
      }`
    });


    // Should always check the bridge to see if the component should update itself (re-render)
    const bUpdateSelf = this.angularPConnect.shouldComponentUpdate( this );

    // ONLY call updateSelf when the component should update
    if (bUpdateSelf || this.caseHasChanged()) {

        this.updateSelf();
    }



  }

  onAttachFiles(files) {
    const attachmentUtils = this.PCore$.getAttachmentUtils();
    const caseID = this.pConn$.getValue(this.PCore$.getConstants().CASE_INFO.CASE_INFO_ID);

    if (files.length > 0) {
      this.lu_bLoading$ = true;
    }

    for (let file of files) {
      attachmentUtils
      .uploadAttachmentAndLinkToCase(
        file,
        caseID,
        this.onUploadProgress,
        this.errorHandler,
        this.pConn$.getContextName()
      )
      .then(() => {
        this.refreshAttachments(file.ID);
      })
      .catch(console.error);
    }

    // reset the list
    this.arFiles$ = [];

  }

  refreshAttachments(attachedFileID) {
    this.updateSelf();

  }




  onUploadProgress(file) {

  }

  errorHandler(isFetchedCanceled, file) {

  }

  onAttachLinks(links) {

    const attachmentUtils = this.PCore$.getAttachmentUtils();
    const caseID = this.pConn$.getValue(this.PCore$.getConstants().CASE_INFO.CASE_INFO_ID);

    if (links.length > 0) {
      this.lu_bLoading$ = true;
    }

    const linksToAttach = links.map((link) => ({
      type: "URL",
      category: "URL",
      url: link.url,
      name: link.linkTitle
    }));

    attachmentUtils
      .linkAttachmentsToCase(caseID, linksToAttach, "URL", this.pConn$.getContextName())
      .then( (data) => {
        this.refreshAttachments(data);
      })
      .catch(console.log);
  }

  addAttachments(attsFromResp: Array<any> = [], attachedFileID: string = "") {
    this.lu_bLoading$ = false;

    attsFromResp = attsFromResp.map((respAtt) => {
      const updatedAtt = {
        ...respAtt,
        meta: `${respAtt.category} . ${this.utils.generateDateTime(respAtt.createTime, "DateTime-Since")}, ${
          respAtt.createdBy
        }`
      };
      if (updatedAtt.type === "FILE") {
        updatedAtt.nameWithExt = updatedAtt.fileName;
      }
      return updatedAtt;
    });


    return attsFromResp;

  }

  onViewAll(arAttachments: Array<any> = []) : void {
    this.bShowViewAllModal$ = true;

    // add clickAway listener
    window.addEventListener('mouseup', this._clickAway.bind(this));
  }


  _clickAway(event: any) {

    var bInPopUp = false;

    //run through list of elements in path, if menu not in th path, then want to 
    // hide (toggle) the menu
    for (let i in event.path) {
      if (event.path[i].className == "psdk-modal-file-top" || event.path[i].tagName == "BUTTON") {
        bInPopUp = true;
        break;
      }
    }
    if (!bInPopUp) {

        this.bShowViewAllModal$ = false
    
        window.removeEventListener('mouseup', this._clickAway.bind(this));
    }





  }

  _closeViewAll() {
    this.bShowViewAllModal$ = false;


    window.removeEventListener('mouseup', this._clickAway.bind(this));
  }

  removeFileFromList(item: any) {
    if (item != null) {
      for (let fileIndex in this.arFileList$) {
        if (this.arFileList$[fileIndex].id == item.id) {
          // remove the file from the list and redraw
          this.ngZone.run( () => {
            this.arFileList$.splice(parseInt(fileIndex), 1);
          });
          break;
        }
      }
    }
  }

  removeLinksFromList(item: any) {

    let localLinksList = this.arLinksList$.slice();

    if (item != null) {
      for (let linkIndex in localLinksList) {
        if (localLinksList[linkIndex].id == item.id) {
          // remove the file from the list and redraw

          localLinksList.splice(parseInt(linkIndex), 1);

          this.ngZone.run(() => {
            this.arLinksList$ = localLinksList.slice();
          });
          

          break;
        }
      }
    }
  }


  getNewListUtilityItemProps = ({
    att,
    cancelFile,
    downloadFile,
    deleteFile,
    removeFile
  }) => {
    let actions;
    let isDownloadable = false;
  
    if (att.progress && att.progress !== 100) {
      actions = [
        {
          id: `Cancel-${att.ID}`,
          text: "Cancel",
          icon: "times",
          onClick: cancelFile
        }
      ];
    } else if (att.links) {
      const isFile = att.type === "FILE";
      const ID = att.ID.replace(/\s/gi, "");
      const actionsMap = new Map([
        [
          "download",
          {
            id: `download-${ID}`,
            text: isFile ? "Download" : "Open",
            icon: isFile ? "download" : "open",
            onClick: downloadFile
          }
        ],
        [
          "delete",
          {
            id: `Delete-${ID}`,
            text: "Delete",
            icon: "trash",
            onClick: deleteFile
          }
        ]
      ]);
      actions = [];
      actionsMap.forEach((action, actionKey) => {
        if (att.links[actionKey]) {
          actions.push(action);
        }
      });
      isDownloadable = att.links.download;
    } else if (att.error) {
      actions = [
        {
          id: `Remove-${att.ID}`,
          text: "Remove",
          icon: "trash",
          onClick: removeFile
        }
      ];
    }
  
    return {
      id: att.ID,
      visual: {
        icon: this.utils.getIconForAttachment(att),
        progress: att.progress == 100 ? undefined: att.progress,
      },
      primary: {
        type: att.type,
        name: att.name,
        icon: "trash",
        click: removeFile,
      },
      secondary: {
        text: att.meta
      },
      actions
    };
  }

  getListUtilityItemProps = ({
    att,
    cancelFile,
    downloadFile,
    deleteFile,
    removeFile
  }) => {
    let actions;
    let isDownloadable = false;
  
    if (att.progress && att.progress !== 100) {
      actions = [
        {
          id: `Cancel-${att.ID}`,
          text: "Cancel",
          icon: "times",
          onClick: cancelFile
        }
      ];
    } else if (att.links) {
      const isFile = att.type === "FILE";
      const ID = att.ID.replace(/\s/gi, "");
      const actionsMap = new Map([
        [
          "download",
          {
            id: `download-${ID}`,
            text: isFile ? "Download" : "Open",
            icon: isFile ? "download" : "open",
            onClick: downloadFile
          }
        ],
        [
          "delete",
          {
            id: `Delete-${ID}`,
            text: "Delete",
            icon: "trash",
            onClick: deleteFile
          }
        ]
      ]);
      actions = [];
      actionsMap.forEach((action, actionKey) => {
        if (att.links[actionKey]) {
          actions.push(action);
        }
      });
      isDownloadable = att.links.download;
    } else if (att.error) {
      actions = [
        {
          id: `Remove-${att.ID}`,
          text: "Remove",
          icon: "trash",
          onClick: removeFile
        }
      ];
    }
  
    return {
      id: att.ID,
      visual: {
        icon: this.utils.getIconForAttachment(att),
        progress: att.progress == 100 ? undefined: att.progress,
      },
      primary: {
        type: att.type,
        name: att.name,
        icon: "open",
        click: downloadFile,
      },
      secondary: {
        text: att.meta
      },
      actions
    };
  }

  _addLink(event: any) {

    // copy list locally
    let localList = this.arLinksList$.slice();

    let url = this.link_url$;
    
    if (!/^(http|https):\/\//.test(this.link_url$ )) {
      this.link_url$  = `http://${this.link_url$ }`;
    }

    // list for display
    let oLink: any = {};
    oLink.icon = "chain";
    
    oLink.ID = `${new Date().getTime()}`;


    oLink = this.getNewListUtilityItemProps({
      att: oLink,
      downloadFile: null,
      cancelFile: null,
      deleteFile: null,
      removeFile: null
    });

    oLink.type = "URL";
    oLink.primary.type = oLink.type;
    oLink.visual.icon = "chain";
    oLink.primary.name = this.link_title$;
    oLink.primary.icon = "open";
    oLink.secondary.text = url;


    this.ngZone.run(() => {
    // need to create a new array or summary list won't detect changes
      this.arLinksList$ = localList.slice();
      this.arLinksList$.push(oLink);


      // list for actually attachments
      let link: any = {};
      link.id = oLink.id;
      link.linkTitle = this.link_title$;
      link.type = oLink.type;
      link.url = url;

      this.arLinks$.push(link);


      // clear values
      this.link_title$ = "";
      this.link_url$ = ""; 
    });


  }

  _changeTitle(event: any) {
    this.link_title$ = event.srcElement.value;

  }

  _changeUrl(event: any) {
    this.link_url$ = event.srcElement.value;
    
  }


  downloadFile(att: any) {


    let attachUtils = this.PCore$.getAttachmentUtils();
    const {ID, name, extension, type} = att;
    let context = this.pConn$.getContextName();

    attachUtils
    .downloadAttachment(ID, context)
    .then((content) => {
      if (type === "FILE") {
        this.fileDownload(content.data, name, extension);
      } else if (type === "URL") {
        let { data } = content;
        if (!/^(http|https):\/\//.test(data)) {
          data = `//${data}`;
        }
        window.open(content.data, "_blank");
      }
    })
    .catch(console.error);
  }

  fileDownload = (data, fileName, ext) => {
    const file = ext ? `${fileName}.${ext}` : fileName;
    download(atob(data), file);
  };

  cancelFile(attID: string) {
    alert("cancel");
  }

  deleteFile(att: any) {

    setTimeout(() => {
      let attachUtils = this.PCore$.getAttachmentUtils();
      const {ID} = att;
      let context = this.pConn$.getContextName();
  
      attachUtils
      .deleteAttachment(ID, context)
      .then(() => {
        this.updateSelf();
        // let newAttachments;
        // setAttachments((current) => {
        //   newAttachments = current.filter((file) => file.ID !== ID);
        //   return newAttachments;
        // });
        // if (callbackFn) {
        //   callbackFn(newAttachments);
        // }
      })
      .catch(console.error);
    });


  }

  removeFile(attID: string) {
    alert("remove");
  }

  removeNewFile(attID: string) {
    alert("remove");
  }

  createModal(modalType: string) {
    switch (modalType) {
      case "addLocalFile" :
        this.ngZone.run( () => {
          this.bShowFileModal$ = true;
        });
        
        break;
      case "addLocalLink" :
        this.ngZone.run( () => {
          this.bShowLinkModal$ = true;
        });
        
        break;
    }
  }

  createModalButtons() {

    this.arFileMainButtons$.push({ actionID: "attach", jsAction: "attachFiles", name: "Attach files"});
    this.arFileSecondaryButtons$.push({ actionID: "cancel", jsAction: "cancel", name: "Cancel"});

    this.arLinkMainButtons$.push({ actionID: "attach", jsAction: "attachLinks", name: "Attach links"});
    this.arLinkSecondaryButtons$.push({ actionID: "cancel", jsAction: "cancel", name: "Cancel"});
  }

  uploadMyFiles($event) {
    //alert($event.target.files[0]); // outputs the first file
    this.arFiles$ = this.getFiles($event.target.files);

    // convert FileList to an array
    let myFiles = Array.from(this.arFiles$);
    
    this.arFileList$ = myFiles.map((att) => {
      return this.getNewListUtilityItemProps({
        att,
        downloadFile: !att.progress ? () => this.downloadFile(att) : null,
        cancelFile: att.progress ? () => this.cancelFile(att.ID) : null,
        deleteFile: !att.progress ? () => this.deleteFile(att) : null,
        removeFile: att.error ? () => this.removeNewFile(att.ID) : null
      });
    });

  }

  getFiles(arFiles: Array<any>): Array<any> {

    return this.setNewFiles(arFiles);
  }

  setNewFiles(arFiles, current = []) {

    let index = 0;
    for (let file of arFiles) {
      if (!this.validateMaxSize(file, 5)) {
        file.error = true;
        file.meta = "File is too big. Max allowed size is 5MB.";
      }
      file.mimeType = file.type;
      file.icon = this.utils.getIconFromFileType(file.type);
      file.ID = `${new Date().getTime()}I${index}`;
      index++;
    }

    return arFiles;
  }

  validateMaxSize(fileObj, maxSizeInMB) : boolean {
    const fileSize = (fileObj.size / 1048576).toFixed(2);
    return fileSize < maxSizeInMB;
  }



  onFileActionButtonClick(event: any) {
    // modal buttons
    switch (event.action) {
      case "cancel" :
        this.bShowFileModal$= false;

        this.clearOutFiles();
        break;
      case "attachFiles":
        this.bShowFileModal$= false;
        this.onAttachFiles(this.arFiles$);

        this.clearOutFiles();
        break;
    }

  }

  onLinkActionButtonClick(event: any) {
    // modal buttons
    switch (event.action) {
      case "cancel" :
        this.bShowLinkModal$= false;

        this.clearOutLinks();
        break;
      case "attachLinks":
        this.bShowLinkModal$= false;
        this.onAttachLinks(this.arLinks$);

        this.clearOutLinks();
        break;
    }

  }

  clearOutFiles() {
    this.arFileList$ = [];
    this.arFiles$ = [];
  }

  clearOutLinks() {
    this.arLinksList$ = [];
    this.arLinks$ = [];
    this.link_title$ = "";
    this.link_url$ = "";
  }

  addALink() {
    
  }

  _fieldOnChangeLink(event: any) {
    this.link_title$ = event.target.value;

  }

  _fieldOnChangeURL(event: any) {
    this.link_url$ = event.target.value;

  }

  updateSelf() {
    
    const attachmentUtils = this.PCore$.getAttachmentUtils();
    const caseID = this.pConn$.getValue(this.PCore$.getConstants().CASE_INFO.CASE_INFO_ID);

    if (caseID && caseID != "") {
      let attPromise = attachmentUtils.getCaseAttachments(caseID, this.pConn$.getContextName());

      this.lu_bLoading$ = true;

      attPromise
        .then( (resp) => {
          this.arFullListAttachments = this.addAttachments(resp);
          this.lu_count$ = this.arFullListAttachments.length;
          this.lu_arActions$ = this.addAttachmentsActions;

          this.lu_arItems$= this.arFullListAttachments.slice(0, 3).map((att) => {
            return this.getListUtilityItemProps({
              att,
              downloadFile: !att.progress ? () => this.downloadFile(att) : null,
              cancelFile: att.progress ? () => this.cancelFile(att.ID) : null,
              deleteFile: !att.progress ? () => this.deleteFile(att) : null,
              removeFile: att.error ? () => this.removeFile(att.ID) : null
            });
          });

          this.va_arItems$= this.arFullListAttachments.map((att) => {
            return this.getListUtilityItemProps({
              att,
              downloadFile: !att.progress ? () => this.downloadFile(att) : null,
              cancelFile: att.progress ? () => this.cancelFile(att.ID) : null,
              deleteFile: !att.progress ? () => this.deleteFile(att) : null,
              removeFile: att.error ? () => this.removeFile(att.ID) : null
            });
          });


        });
    }

    

  }

  caseHasChanged() : boolean {
    const caseID = this.pConn$.getValue(this.PCore$.getConstants().CASE_INFO.CASE_INFO_ID);
    if (this.currentCaseID !== caseID) {
      this.currentCaseID = caseID;
      return true;
    }

    return false;
  }

 



}



