import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MaterialSummaryListComponent } from './material-summary-list.component';

describe('MaterialSummaryListComponent', () => {
  let component: MaterialSummaryListComponent;
  let fixture: ComponentFixture<MaterialSummaryListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialSummaryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialSummaryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
