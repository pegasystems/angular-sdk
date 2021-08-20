import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ThreeColumnPageComponent } from './three-column-page.component';

describe('ThreeColumnPageComponent', () => {
  let component: ThreeColumnPageComponent;
  let fixture: ComponentFixture<ThreeColumnPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreeColumnPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeColumnPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
