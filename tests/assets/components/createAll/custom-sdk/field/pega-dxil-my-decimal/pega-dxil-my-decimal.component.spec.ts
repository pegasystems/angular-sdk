import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PegaDxilMyDecimalComponent } from './pega-dxil-my-decimal.component';

describe('PegaDxilMyDecimalComponent', () => {
  let component: PegaDxilMyDecimalComponent;
  let fixture: ComponentFixture<DecimalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PegaDxilMyDecimalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PegaDxilMyDecimalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
