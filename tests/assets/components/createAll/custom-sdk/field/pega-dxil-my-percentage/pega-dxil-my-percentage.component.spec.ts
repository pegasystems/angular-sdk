import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PegaDxilMyPercentageComponent } from './pega-dxil-my-percentage.component';

describe('PegaDxilMyPercentageComponent', () => {
  let component: PegaDxilMyPercentageomponent;
  let fixture: ComponentFixture<PegaDxilMyPercentageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PegaDxilMyPercentageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PegaDxilMyPercentageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
