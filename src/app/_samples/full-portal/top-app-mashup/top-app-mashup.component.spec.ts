import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TopAppMashupComponent } from './top-app-mashup.component';

describe('TopAppMashupComponent', () => {
  let component: TopAppMashupComponent;
  let fixture: ComponentFixture<TopAppMashupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TopAppMashupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopAppMashupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
