import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WideNarrowFormComponent } from './wide-narrow-form.component';

describe('WideNarrowFormComponent', () => {
  let component: WideNarrowFormComponent;
  let fixture: ComponentFixture<WideNarrowFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WideNarrowFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WideNarrowFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
