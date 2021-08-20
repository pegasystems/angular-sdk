import { TestBed } from '@angular/core/testing';

import { GetLoginStatusService } from './get-login-status.service';

describe('GetLoginStatusService', () => {
  let service: GetLoginStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetLoginStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
