import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PegaDxilMyPageWidgetComponent } from './pega-dxil-my-page-widget.component';

describe('PegaDxilMyPageWidgetComponent', () => {
  let component: PegaDxilMyPageWidgetComponent;
  let fixture: ComponentFixture<PegaDxilMyPageWidgetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PegaDxilMyPageWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PegaDxilMyPageWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
