import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SimpleTableSelectComponent } from './simple-table-select.component';

describe('SimpleTableSelectComponent', () => {
  let component: SimpleTableSelectComponent;
  let fixture: ComponentFixture<SimpleTableSelectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleTableSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleTableSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});