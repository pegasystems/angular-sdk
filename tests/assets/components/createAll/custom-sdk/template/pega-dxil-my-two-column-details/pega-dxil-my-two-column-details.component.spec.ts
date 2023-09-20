import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PegaDxilMyTwoColumnDetailsComponent } from './pega-dxil-my-two-column-details.component';

describe('PegaDxilMyTwoColumnDetailsComponent', () => {
  let component: PegaDxilMyTwoColumnDetailsComponent;
  let fixture: ComponentFixture<PegaDxilMyTwoColumnDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PegaDxilMyTwoColumnDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PegaDxilMyTwoColumnDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
