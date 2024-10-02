import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { YourOrgYourComponentLibMyTextComponent } from './your-org-your-component-lib-my-text.component';

describe('YourOrgYourComponentLibMyTextComponent', () => {
  let component: YourOrgYourComponentLibMyTextComponent;
  let fixture: ComponentFixture<YourOrgYourComponentLibMyTextComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [YourOrgYourComponentLibMyTextComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YourOrgYourComponentLibMyTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
