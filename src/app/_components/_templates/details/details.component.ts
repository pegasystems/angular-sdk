import { Component, OnInit, Input } from '@angular/core';
import { AngularPConnectService } from "../../../_bridge/angular-pconnect";

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  constructor(private angularPConnect: AngularPConnectService) { }

  @Input() pConn$: any;

  arFields$: Array<any> = [];


  // Used with AngularPConnect
  angularPConnectData: any = {};

  ngOnInit(): void {

       // First thing in initialization is registering and subscribing to the AngularPConnect service
       this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);

       this.updateSelf();

  }

  ngOnDestroy() {

    if (this.angularPConnectData.unsubscribeFn) {
      this.angularPConnectData.unsubscribeFn();
    }

  }

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
 

  let kids = this.pConn$.getChildren();
  for (let kid of kids) {
    let pKid = kid.getPConnect();
    let pKidData = pKid.resolveConfigProps(pKid.getRawMetadata());
    if (kids.indexOf(kid) == 0) {
      this.arFields$ = pKidData.children;
    }

  }


 }

}
