import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RadioButtonsComponent } from './radio-buttons.component';

describe('RadioButtonsComponent', () => {
  let component: RadioButtonsComponent;
  let fixture: ComponentFixture<RadioButtonsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RadioButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
