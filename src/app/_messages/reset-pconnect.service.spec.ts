import { TestBed } from '@angular/core/testing';

import { ResetPConnectService } from './reset-pconnect.service';

describe('ResetPConnectService', () => {
  let service: ResetPConnectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResetPConnectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
