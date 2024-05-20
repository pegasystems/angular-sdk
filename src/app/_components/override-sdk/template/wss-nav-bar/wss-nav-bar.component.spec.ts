import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WssNavBarComponent } from './wss-nav-bar.component';

describe('WssNavBarComponent', () => {
  let component: WssNavBarComponent;
  let fixture: ComponentFixture<WssNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WssNavBarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(WssNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
