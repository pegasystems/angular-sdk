import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsNarrowWideComponent } from './details-narrow-wide.component';

describe('DetailsNarrowWideComponent', () => {
  let component: DetailsNarrowWideComponent;
  let fixture: ComponentFixture<DetailsNarrowWideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsNarrowWideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsNarrowWideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
