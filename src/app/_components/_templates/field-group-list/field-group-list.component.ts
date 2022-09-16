import { Component, OnInit, Input } from '@angular/core';
import { element } from 'protractor';
import { AngularPConnectService } from "../../../_bridge/angular-pconnect";
import { FieldGroupUtils } from '../../../_helpers/field-group-utils';

@Component({
    selector: 'app-field-group-list',
    templateUrl: './field-group-list.component.html',
    styleUrls: ['./field-group-list.component.scss']
})
export class FieldGroupListComponent implements OnInit {
    @Input() item;
    @Input() name;

    fields: any = [];

    ngOnInit(): void { 
    }

    ngOnChanges(changes) {
        if (changes && changes.item) {
            const item = changes.item;
            if (item.currentValue !== item.previousValue) {
                this.fields = [];
                for (const label in this.item) {
                    if (label !== 'classID') {
                        this.fields.push({ label, value: this.item[label] });
                    }
                }
            }
        }
    }

}