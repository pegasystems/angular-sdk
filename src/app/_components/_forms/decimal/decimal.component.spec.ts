import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DecimalComponent } from './decimal.component';

describe('DecimalComponent', () => {
  let component: DecimalComponent;
  let fixture: ComponentFixture<DecimalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DecimalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecimalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
