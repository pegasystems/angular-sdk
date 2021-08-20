import { TestBed } from '@angular/core/testing';

import { AutoLoginService } from './auto-login.service';

describe('AutoLoginService', () => {
  let service: AutoLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutoLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
