import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MCMainContentComponent } from './mc-main-content.component';

describe('MainContentComponent', () => {
  let component: MCMainContentComponent;
  let fixture: ComponentFixture<MCMainContentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCMainContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCMainContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
