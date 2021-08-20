import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UtilityComponent } from './utility.component';

describe('UtilityComponent', () => {
  let component: UtilityComponent;
  let fixture: ComponentFixture<UtilityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UtilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UtilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
