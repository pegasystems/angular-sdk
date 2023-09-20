import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PegaDxilMyCaseWidgetComponent } from './pega-dxil-my-case-widget.component';

describe('PegaDxilMyCaseWidgetComponent', () => {
  let component: PegaDxilMyCaseWidgetComponent;
  let fixture: ComponentFixture<PegaDxilMyCaseWidgetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PegaDxilMyCaseWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PegaDxilMyCaseWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
