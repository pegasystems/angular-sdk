import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MultiStepComponent } from './multi-step.component';

describe('MultiStepComponent', () => {
  let component: MultiStepComponent;
  let fixture: ComponentFixture<MultiStepComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
