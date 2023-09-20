import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PegaDxilMyTwoColumnFormComponent } from './pega-dxil-my-two-column-form.component';

describe('PegaDxilMyTwoColumnFormComponent', () => {
  let component: PegaDxilMyTwoColumnFormComponent;
  let fixture: ComponentFixture<PegaDxilMyTwoColumnFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PegaDxilMyTwoColumnFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PegaDxilMyTwoColumnFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
