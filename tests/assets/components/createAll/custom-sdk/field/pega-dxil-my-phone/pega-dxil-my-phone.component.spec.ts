import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PegaDxilMyPhoneComponent } from './pega-dxil-my-phone.component';

describe('PegaDxilMyPhoneComponent', () => {
  let component: PegaDxilMyPhoneComponent;
  let fixture: ComponentFixture<PegaDxilMyPhoneComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PegaDxilMyPhoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PegaDxilMyPhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
