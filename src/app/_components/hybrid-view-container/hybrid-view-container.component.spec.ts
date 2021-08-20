import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HybridViewContainerComponent } from './hybrid-view-container.component';

describe('HybridViewContainerComponent', () => {
  let component: HybridViewContainerComponent;
  let fixture: ComponentFixture<HybridViewContainerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HybridViewContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HybridViewContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
