import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CaseCreateStageComponent } from './case-create-stage.component';

describe('CaseCreateStageComponent', () => {
  let component: CaseCreateStageComponent;
  let fixture: ComponentFixture<CaseCreateStageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseCreateStageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseCreateStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
