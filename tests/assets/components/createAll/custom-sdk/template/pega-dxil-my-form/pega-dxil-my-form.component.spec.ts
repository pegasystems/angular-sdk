import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PegaDxilMyFormComponent } from './pega-dxil-my-form.component';

describe('PegaDxilMyFormComponent', () => {
  let component: PegaDxilMyFormComponent;
  let fixture: ComponentFixture<PegaDxilMyFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PegaDxilMyFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PegaDxilMyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
