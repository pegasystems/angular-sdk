import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialDetailsFieldsComponent } from './material-details-fields.component';

describe('MaterialDetailsFieldsComponent', () => {
  let component: MaterialDetailsFieldsComponent;
  let fixture: ComponentFixture<MaterialDetailsFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialDetailsFieldsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialDetailsFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
