import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OneColumnPageComponent } from './one-column-page.component';

describe('OneColumnPageComponent', () => {
  let component: OneColumnPageComponent;
  let fixture: ComponentFixture<OneColumnPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OneColumnPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneColumnPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
