import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DetailsSubTabsComponent } from './details-sub-tabs.component';

describe('DetailsSubTabsComponent', () => {
  let component: DetailsSubTabsComponent;
  let fixture: ComponentFixture<DetailsSubTabsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsSubTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsSubTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});