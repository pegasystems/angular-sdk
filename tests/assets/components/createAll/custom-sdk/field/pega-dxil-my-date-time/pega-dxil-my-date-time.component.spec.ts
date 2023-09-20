import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PegaDxilMyDateTimeComponent } from './pega-dxil-my-date-time.component';

describe('PegaDxilMyDateTimeComponent', () => {
  let component: PegaDxilMyDateTimeComponent;
  let fixture: ComponentFixture<PegaDxilMyDateTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PegaDxilMyDateTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PegaDxilMyDateTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
