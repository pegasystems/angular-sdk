import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PegaDxilMyTimeOfDayComponent } from './pega-dxil-my-time-of-day.component';

describe('PegaDxilMyTimeOfDayComponent', () => {
  let component: PegaDxilMyTimeOfDayComponent;
  let fixture: ComponentFixture<PegaDxilMyTimeOfDayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PegaDxilMyTimeOfDayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PegaDxilMyTimeOfDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
