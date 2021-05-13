import { TestBed } from '@angular/core/testing';

import { TwitterHandleService } from './twitter-handle.service';

describe('TwitterHandleService', () => {
  let service: TwitterHandleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TwitterHandleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
