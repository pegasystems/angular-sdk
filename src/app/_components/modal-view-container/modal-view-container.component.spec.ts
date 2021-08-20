import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalViewContainerComponent } from './modal-view-container.component';

describe('ModalViewContainerComponent', () => {
  let component: ModalViewContainerComponent;
  let fixture: ComponentFixture<ModalViewContainerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalViewContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalViewContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
