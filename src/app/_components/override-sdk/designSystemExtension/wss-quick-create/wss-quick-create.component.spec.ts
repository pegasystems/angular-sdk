import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WssQuickCreateComponent } from './wss-quick-create.component';

describe('WssQuickCreateComponent', () => {
  let component: WssQuickCreateComponent;
  let fixture: ComponentFixture<WssQuickCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WssQuickCreateComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(WssQuickCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
