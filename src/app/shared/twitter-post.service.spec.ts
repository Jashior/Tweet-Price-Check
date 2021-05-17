import { TestBed } from '@angular/core/testing';

import { TwitterPostService } from './twitter-post.service';

describe('TwitterPostService', () => {
  let service: TwitterPostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TwitterPostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
