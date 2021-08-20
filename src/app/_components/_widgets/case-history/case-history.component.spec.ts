import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseHistoryComponent } from './case-history.component';

describe('CaseHistoryComponent', () => {
  let component: CaseHistoryComponent;
  let fixture: ComponentFixture<CaseHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
