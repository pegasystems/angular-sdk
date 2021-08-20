import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MaterialSummaryItemComponent } from './material-summary-item.component';

describe('MaterialSummaryItemComponent', () => {
  let component: MaterialSummaryItemComponent;
  let fixture: ComponentFixture<MaterialSummaryItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialSummaryItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialSummaryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
