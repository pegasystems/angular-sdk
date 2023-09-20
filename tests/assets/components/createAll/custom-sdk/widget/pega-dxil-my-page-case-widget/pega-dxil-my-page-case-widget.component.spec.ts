import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PegaDxilMyPageCaseWidgetComponent } from './pega-dxil-my-page-case-widget.component';

describe('PegaDxilMyPageCaseWidgetComponent', () => {
  let component: PegaDxilMyPageCaseWidgetComponent;
  let fixture: ComponentFixture<PegaDxilMyPageCaseWidgetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PegaDxilMyPageCaseWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PegaDxilMyPageCaseWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
