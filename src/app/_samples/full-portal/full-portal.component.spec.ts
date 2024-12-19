import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FullPortalComponent } from './full-portal.component';

describe('FullPortalComponent', () => {
  let component: FullPortalComponent;
  let fixture: ComponentFixture<FullPortalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FullPortalComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
