import { TestBed } from '@angular/core/testing';

import { UpdateWorklistService } from './update-worklist.service';

describe('UpdateWorklistService', () => {
  let service: UpdateWorklistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateWorklistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
