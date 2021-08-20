import { TestBed } from '@angular/core/testing';

import { AngularPConnectService } from './angular-pconnect';

describe('AngularPConnectService', () => {
  let service: AngularPConnectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AngularPConnectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
