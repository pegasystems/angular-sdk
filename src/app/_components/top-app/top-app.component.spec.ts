import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TopAppComponent } from './top-app.component';

describe('TopAppComponent', () => {
  let component: TopAppComponent;
  let fixture: ComponentFixture<TopAppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TopAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
