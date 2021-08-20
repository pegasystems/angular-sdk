import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MaterialUtilityComponent } from './material-utility.component';

describe('MaterialutilityComponent', () => {
  let component: MaterialUtilityComponent;
  let fixture: ComponentFixture<MaterialUtilityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialUtilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialUtilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
