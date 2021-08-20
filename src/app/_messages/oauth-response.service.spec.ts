import { TestBed } from '@angular/core/testing';

import { OAuthResponseService } from './oauth-response.service';

describe('OAuthResponseService', () => {
  let service: OAuthResponseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OAuthResponseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
