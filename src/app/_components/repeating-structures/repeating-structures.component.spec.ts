import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RepeatingStructuresComponent } from './repeating-structures.component';

describe('RepeatingStructuresComponent', () => {
  let component: RepeatingStructuresComponent;
  let fixture: ComponentFixture<RepeatingStructuresComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RepeatingStructuresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepeatingStructuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
