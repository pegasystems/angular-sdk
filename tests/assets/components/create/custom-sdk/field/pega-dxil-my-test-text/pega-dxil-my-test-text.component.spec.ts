import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PegaDxilMyTestTextComponent } from './pega-dxil-my-test-text.component';

describe('PegaDxilMyTestTextComponent', () => {
  let component: PegaDxilMyTestTextComponent;
  let fixture: ComponentFixture<PegaDxilMyTestTextComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PegaDxilMyTestTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PegaDxilMyTestTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
