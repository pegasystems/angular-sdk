import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MaterialVerticalTabsComponent } from './material-vertical-tabs.component';

describe('MaterialVerticalTabsComponent', () => {
  let component: MaterialVerticalTabsComponent;
  let fixture: ComponentFixture<MaterialVerticalTabsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialVerticalTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialVerticalTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
