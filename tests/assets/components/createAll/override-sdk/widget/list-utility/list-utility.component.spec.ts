import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListUtilityComponent } from './list-utility.component';

describe('ListUtilityComponent', () => {
  let component: ListUtilityComponent;
  let fixture: ComponentFixture<ListUtilityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListUtilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListUtilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
