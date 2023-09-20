import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OneColumnComponent } from './one-column.component';

describe('OneColumnComponent', () => {
  let component: OneColumnComponent;
  let fixture: ComponentFixture<OneColumnComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OneColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
