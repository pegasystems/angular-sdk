import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResolutionScreenComponent } from './resolution-screen.component';

describe('ResolutionScreenComponent', () => {
  let component: ResolutionScreenComponent;
  let fixture: ComponentFixture<ResolutionScreenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResolutionScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolutionScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
