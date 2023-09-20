import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PulseComponent } from './pulse.component';

describe('PulseComponent', () => {
  let component: PulseComponent;
  let fixture: ComponentFixture<PulseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PulseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PulseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
