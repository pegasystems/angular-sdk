import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TwoColumnTabComponent } from './two-column-tab.component';

describe('TwoColumnTabComponent', () => {
  let component: TwoColumnTabComponent;
  let fixture: ComponentFixture<TwoColumnTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TwoColumnTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoColumnTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
