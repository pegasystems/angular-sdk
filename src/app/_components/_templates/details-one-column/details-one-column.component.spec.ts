import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsOneColumnComponent } from './details-one-column.component';

describe('DetailsOneColumnComponent', () => {
  let component: DetailsOneColumnComponent;
  let fixture: ComponentFixture<DetailsOneColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsOneColumnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsOneColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
