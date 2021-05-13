import { TestBed } from '@angular/core/testing';

import { ApiHandleService } from './api-handle.service';

describe('ApiHandleService', () => {
  let service: ApiHandleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiHandleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
