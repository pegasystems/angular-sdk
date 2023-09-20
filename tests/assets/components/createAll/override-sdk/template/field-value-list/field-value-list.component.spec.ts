import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldValueListComponent } from './field-value-list.component';

describe('FieldValueListComponent', () => {
  let component: FieldValueListComponent;
  let fixture: ComponentFixture<FieldValueListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldValueListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldValueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
