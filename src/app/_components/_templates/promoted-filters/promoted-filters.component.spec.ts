import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PromotedFiltersComponent } from './promoted-filters.component';

describe('PromotedFiltersComponent', () => {
  let component: PromotedFiltersComponent;
  let fixture: ComponentFixture<PromotedFiltersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotedFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotedFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
