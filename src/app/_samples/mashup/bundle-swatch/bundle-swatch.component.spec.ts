import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BundleSwatchComponent } from './bundle-swatch.component';

describe('BundleSwatchComponent', () => {
  let component: BundleSwatchComponent;
  let fixture: ComponentFixture<BundleSwatchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BundleSwatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BundleSwatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
