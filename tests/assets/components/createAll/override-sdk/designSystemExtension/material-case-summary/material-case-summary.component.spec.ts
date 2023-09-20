import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MaterialCaseSummaryComponent } from './material-case-summary.component';

describe('MaterialCaseSummaryComponent', () => {
  let component: MaterialCaseSummaryComponent;
  let fixture: ComponentFixture<MaterialCaseSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialCaseSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialCaseSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
