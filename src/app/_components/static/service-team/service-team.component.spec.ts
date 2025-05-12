import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceTeamComponent } from './service-team.component';

describe('ServiceTeamComponent', () => {
  let component: ServiceTeamComponent;
  let fixture: ComponentFixture<ServiceTeamComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ServiceTeamComponent]
    });
    fixture = TestBed.createComponent(ServiceTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
