import { TestBed } from '@angular/core/testing';

import { DatapageService } from './datapage.service';

describe('DatapageService', () => {
  let service: DatapageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatapageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
