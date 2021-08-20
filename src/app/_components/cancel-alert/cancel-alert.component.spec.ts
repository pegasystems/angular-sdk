import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CancelAlertComponent } from './cancel-alert.component';

describe('CancelAlertComponent', () => {
  let component: CancelAlertComponent;
  let fixture: ComponentFixture<CancelAlertComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
