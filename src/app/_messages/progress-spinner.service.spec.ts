import { TestBed } from '@angular/core/testing';

import { ProgressSpinnerService } from './progress-spinner.service';

describe('ProgressSpinnerService', () => {
  let service: ProgressSpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgressSpinnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
