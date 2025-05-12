import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverProfilesComponent } from './driver-profiles.component';

describe('DriverProfilesComponent', () => {
  let component: DriverProfilesComponent;
  let fixture: ComponentFixture<DriverProfilesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DriverProfilesComponent]
    });
    fixture = TestBed.createComponent(DriverProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
