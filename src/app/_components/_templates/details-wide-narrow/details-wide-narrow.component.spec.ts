import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsWideNarrowComponent } from './details-wide-narrow.component';

describe('DetailsWideNarrowComponent', () => {
  let component: DetailsWideNarrowComponent;
  let fixture: ComponentFixture<DetailsWideNarrowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsWideNarrowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsWideNarrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
