import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeferLoadComponent } from './defer-load.component';

describe('DeferLoadComponent', () => {
  let component: DeferLoadComponent;
  let fixture: ComponentFixture<DeferLoadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DeferLoadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeferLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
