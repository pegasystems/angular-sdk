import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceHistoryComponent } from './service-history.component';

describe('ServiceHistoryComponent', () => {
  let component: ServiceHistoryComponent;
  let fixture: ComponentFixture<ServiceHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ServiceHistoryComponent]
    });
    fixture = TestBed.createComponent(ServiceHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
