import { Component, OnInit, Input } from '@angular/core';
import { AngularPConnectService } from "../../../_bridge/angular-pconnect";
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-multi-reference-readonly',
    templateUrl: './multi-reference-readonly.component.html',
    styleUrls: ['./multi-reference-readonly.component.scss']
})
export class MultiReferenceReadonlyComponent implements OnInit {

    constructor(private angularPConnect: AngularPConnectService) { }

    @Input() pConn$: any;
    @Input() formGroup$: FormGroup;
    
    configProps$ : any;
    angularPConnectData: any = {};
    label: string;
    ngOnInit(): void {
        // First thing in initialization is registering and subscribing to the AngularPConnect service
        this.angularPConnectData = this.angularPConnect.registerAndSubscribeComponent(this, this.onStateChange);
        this.updateSelf();
    }

    onStateChange() {
        // Should always check the bridge to see if the component should
        // update itself (re-render)
        const bUpdateSelf = this.angularPConnect.shouldComponentUpdate(this);
        // ONLY call updateSelf when the component should update
        if (bUpdateSelf) {
            this.updateSelf();
        }
    
    }

    updateSelf() {
        this.configProps$ = this.pConn$.getConfigProps();
        this.label = this.configProps$['label'];
    }
}
