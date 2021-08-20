import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FlowContainerComponent } from './flow-container.component';

describe('FlowContainerComponent', () => {
  let component: FlowContainerComponent;
  let fixture: ComponentFixture<FlowContainerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
