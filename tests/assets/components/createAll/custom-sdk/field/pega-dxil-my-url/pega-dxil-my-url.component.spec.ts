
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PegaDxilMyUrlComponent } from './pega-dxil-my-url.component';

describe('PegaDxilMyUrlComponent', () => {
  let component: PegaDxilMyUrlComponent;
  let fixture: ComponentFixture<PegaDxilMyUrlComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PegaDxilMyUrlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PegaDxilMyUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
