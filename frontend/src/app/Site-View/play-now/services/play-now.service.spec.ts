import { TestBed } from '@angular/core/testing';

import { PlayNowService } from './play-now.service';

describe('PlayNowService', () => {
  let service: PlayNowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayNowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
