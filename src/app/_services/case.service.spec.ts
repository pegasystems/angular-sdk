import { TestBed } from '@angular/core/testing';

import { CaseService } from './case.service';

describe('CaseService', () => {
  let service: CaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
