import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.scss']
})
export class ListPageComponent implements OnInit {

  @Input() pConn$: any;

  constructor() { }

  ngOnInit(): void {


  }

}
