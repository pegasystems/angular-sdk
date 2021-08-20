import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppAnnouncementComponent } from './app-announcement.component';

describe('AppAnnouncementComponent', () => {
  let component: AppAnnouncementComponent;
  let fixture: ComponentFixture<AppAnnouncementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppAnnouncementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppAnnouncementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
