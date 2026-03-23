import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickCreateComponent } from './quick-create.component';

describe('QuickCreateComponent', () => {
  let component: QuickCreateComponent;
  let fixture: ComponentFixture<QuickCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuickCreateComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(QuickCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
