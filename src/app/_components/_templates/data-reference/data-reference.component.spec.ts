import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DataReferenceComponent } from './data-reference.component';

describe('DataReferenceComponent', () => {
  let component: DataReferenceComponent;
  let fixture: ComponentFixture<DataReferenceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DataReferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
