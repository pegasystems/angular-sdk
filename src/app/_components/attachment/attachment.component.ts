import { Component, OnInit, Input, ErrorHandler } from '@angular/core';
import { AngularPConnectService } from "../../_bridge/angular-pconnect";
import { Utils } from "../../_helpers/utils";
import { NgZone } from '@angular/core';
import { FileUtilityComponent } from '../_widgets/file-utility/file-utility.component';

import download from "downloadjs";

@Component({
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.scss']
})
export class AttachmentComponent implements OnInit {


  @Input() pConn$: any;

  label$: string = "";
  value$: any;
  bRequired$: boolean = false;
  bReadonly$: boolean = false;
  bDisabled$: boolean = false;
  bVisible$: boolean = true;

  bLoading$: boolean = false;

  arFiles$: Array<any> = [];
  arFileList$: Array<any> = [];
  removeFileFromList$: any;

  arMenuList$: Array<any> = [];

  bShowSelector$: boolean = true;
  bShowJustDelete$: boolean = false;


  PCore$: any;

  att_valueRef: any;
  att_categoryName: string;


  // For interaction with AngularPConnect
  angularPConnectData: any = {};

  constructor(private angularPConnect: AngularPConnectService,
              private utils: Utils,
              private ngZone: NgZone) { }

  ngOnInit(): void {

    // // First thing in initialization is registering and subscribing to the AngularPConnect service
    this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);

    if (!this.PCore$) {
      this.PCore$ = window.PCore;
    }

    
    this.removeFileFromList$ = { onClick: this._removeFileFromList.bind(this) }


    //let configProps: any = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());
    this.updateSelf();

  }

  ngOnDestroy(): void {

    if (this.angularPConnectData.unsubscribeFn) {
      this.angularPConnectData.unsubscribeFn();
    }

  }


  // Callback passed when subscribing to store change
  onStateChange() {
    // Should always check the bridge to see if the component should update itself (re-render)
    const bUpdateSelf = this.angularPConnect.shouldComponentUpdate( this );

    // ONLY call updateSelf when the component should update
    //    AND removing the "gate" that was put there since shouldComponentUpdate
    //      should be the real "gate"
    if (bUpdateSelf) {

        this.updateSelf();
    }



  }


  updateSelf() {

    let configProps: any = this.pConn$.resolveConfigProps(this.pConn$.getConfigProps());

    const { value, validatemessage, label, helperText } = configProps;


    if (configProps["required"] != null) {
      this.bRequired$ = this.utils.getBooleanValue(configProps["required"]);
    }
    if (configProps["visibility"] != null) {
      this.bVisible$ = this.utils.getBooleanValue(configProps["visibility"]);
    }

     // disabled
     if (configProps["disabled"] != undefined) {
      this.bDisabled$ = this.utils.getBooleanValue(configProps["disabled"]);
    }
       
    if (configProps["readOnly"] != null) {
      this.bReadonly$ = this.utils.getBooleanValue(configProps["readOnly"]);
    } 

    this.label$ = label;
    this.value$ = value;

    /* this is a temporary fix because required is supposed to be passed as a boolean and NOT as a string */
    let { required, disabled } = configProps;
    [required, disabled] = [required, disabled].map(
      (prop) => prop === true || (typeof prop === "string" && prop === "true")
    );
  

    this.att_categoryName = "";
    if (value && value.pyCategoryName) {
      this.att_categoryName = value.pyCategoryName;
    }
  
    this.att_valueRef = this.pConn$.getStateProps().value;
    this.att_valueRef = this.att_valueRef.indexOf(".") === 0 ? this.att_valueRef.substring(1) : this.att_valueRef;

    let fileTemp: any = {};
  
    if (value && value.pxResults && +value.pyCount > 0) {
      fileTemp = this.buildFilePropsFromResponse(value.pxResults[0]);

      if (fileTemp.responseProps) {
        if (!this.pConn$.attachmentsInfo) {
          this.pConn$.attachmentsInfo = {
            type: "File",
            attachmentFieldName: this.att_valueRef,
            category: this.att_categoryName
          };
        }
  
        if (
          fileTemp.responseProps.pzInsKey &&
          !fileTemp.responseProps.pzInsKey.includes("temp")
        ) {

          fileTemp.props.type = fileTemp.responseProps.pyMimeFileExtension;
          fileTemp.props.mimeType = fileTemp.responseProps.pyMimeFileExtension;

          // create the actions for the "more" menu on the attachment
          let arMenuList = new Array();
          let oMenu: any = {};

          oMenu.icon = "download";
          oMenu.text = "Download";
          oMenu.onClick = () => { this._downloadFileFromList(this.value$.pxResults[0])}
          arMenuList.push(oMenu);
          oMenu = {};
          oMenu.icon = "trash";
          oMenu.text = "Delete";
          oMenu.onClick = () => { this._removeFileFromList(this.arFileList$[0])}
          arMenuList.push(oMenu);

          
          this.arFileList$ = new Array();
          this.arFileList$.push(this.getNewListUtilityItemProps({
            att: fileTemp.props,
            downloadFile: null,
            cancelFile: null,
            deleteFile: null,
            removeFile: null
          }));

          this.arFileList$[0].actions = arMenuList;

          this.bShowSelector$ = false;
        }
      }
    }
  
  

  }


  _downloadFileFromList(fileObj: any) {
    this.PCore$.getAttachmentUtils()
      .downloadAttachment(fileObj.pzInsKey, this.pConn$.getContextName())
      .then((content) => {
        const extension = fileObj.pyAttachName.split(".").pop();
        this.fileDownload(content.data, fileObj.pyFileName, extension);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  fileDownload = (data, fileName, ext) => {
    const file = ext ? `${fileName}.${ext}` : fileName;
    download(atob(data), file);
  };

  _removeFileFromList(item: any) {
    if (item != null) {
      for (let fileIndex in this.arFileList$) {
        if (this.arFileList$[fileIndex].id == item.id) {
          // remove the file from the list and redraw
          this.ngZone.run( () => {
            this.arFileList$.splice(parseInt(fileIndex), 1);

            // call delete attachment
            if (this.value$ && this.value$.pxResults[0]) {
              this.pConn$.attachmentsInfo = {
                type: "File",
                attachmentFieldName: this.att_valueRef,
                delete: true
              };
            } else {
              this.pConn$.attachmentsInfo = null;
            }

            this.bShowSelector$ = true;
          });
          break;
        }
      }
    }
  }

  uploadMyFiles(event: any) {
    //alert($event.target.files[0]); // outputs the first file
    this.arFiles$ = this.getFiles(event.target.files);

    // convert FileList to an array
    let myFiles = Array.from(this.arFiles$);

    if (myFiles.length == 1) {

      this.bLoading$ = true;

      this.PCore$.getAttachmentUtils()
        .uploadAttachment(
          myFiles[0],
          this.onUploadProgress,
          this.errorHandler,
          this.pConn$.getContextName()
        )
        .then((fileRes) => {
          

          this.pConn$.attachmentsInfo = {
            type: "File",
            attachmentFieldName: this.att_valueRef,
            category: this.att_categoryName,
            ID: fileRes.data.ID
          };
  
          const fieldName = this.pConn$.getStateProps().value;
          const context = this.pConn$.getContextName();
  
          this.PCore$.getMessageManager().clearMessages({
            type: this.PCore$.getConstants().MESSAGES.MESSAGES_TYPE_ERROR,
            property: fieldName,
            pageReference: this.pConn$.getPageReference(),
            context
          });

          this.ngZone.run(() => {
            this.bShowSelector$ = false;
            myFiles[0].meta = "File uplooaded successfully";
            this.arFileList$ = myFiles.map((att) => {
              return this.getNewListUtilityItemProps({
                att,
                downloadFile: null,
                cancelFile: null,
                deleteFile: null,
                removeFile: null
              });
            });

            this.bShowJustDelete$ = true;
            this.bLoading$ = false;

          });


        })
        // eslint-disable-next-line no-unused-vars
        .catch((error) => {
          // just catching the rethrown error at uploadAttachment
          // to handle Unhandled rejections
        });
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

  onUploadProgress() {

  }

  errorHandler() {

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


 buildFilePropsFromResponse(respObj) {
    return {
      props: {
        meta: `${respObj.pyCategoryName}, ${respObj.pxCreateOperator}`,
        name: respObj.pyAttachName,
        icon: this.utils.getIconFromFileType(respObj.pyMimeFileExtension)
      },
      responseProps: {
        ...respObj
      }
    };
  }


}
