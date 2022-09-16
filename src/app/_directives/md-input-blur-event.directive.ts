import {Directive,Output,ViewContainerRef,EventEmitter, OnInit} from '@angular/core';
import { MatInput } from '@angular/material/input';

@Directive({
    selector: 'input[matInput]'
})
export class MdInputBlurEventDirective implements OnInit {
    @Output('blur') blur:EventEmitter<any> = new EventEmitter();
    private _component:MatInput;

    constructor( private _vewContainerRef: ViewContainerRef){ }

    ngOnInit() {
        let me = this;
        me._component = (<any>me._vewContainerRef).element.nativeElement;

        me._component['onblur'] = ()=>{
          me.onBlur();
        }
    }

    onBlur() {
        console.log("#############")
        this.blur.next({target:{value:this._component.value}});
        // (<any>this._component)._focused = false;
        // (<any>this._component)._onTouchedCallback();
    }

}