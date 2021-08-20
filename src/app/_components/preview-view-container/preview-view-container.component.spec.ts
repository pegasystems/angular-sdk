import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PreviewViewContainerComponent } from './preview-view-container.component';

describe('PreviewViewContainerComponent', () => {
  let component: PreviewViewContainerComponent;
  let fixture: ComponentFixture<PreviewViewContainerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewViewContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewViewContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
