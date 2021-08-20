import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CaseSummaryComponent } from './case-summary.component';

describe('CaseSummaryComponent', () => {
  let component: CaseSummaryComponent;
  let fixture: ComponentFixture<CaseSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
