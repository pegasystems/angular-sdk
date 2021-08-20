import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MCNavComponent } from './mc-nav.component';

describe('MCNavComponent', () => {
  let component: MCNavComponent;
  let fixture: ComponentFixture<MCNavComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
