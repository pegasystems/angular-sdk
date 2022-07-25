import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-single-reference-readonly',
    templateUrl: './single-reference-readonly.component.html',
    styleUrls: ['./single-reference-readonly.component.scss']
})
export class SingleReferenceReadonlyComponent implements OnInit {

    @Input() pConn$: any;
    @Input() formGroup$: FormGroup;
    
    ngOnInit(): void {

    }

}