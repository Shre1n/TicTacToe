import { TestBed } from '@angular/core/testing';

import { PlayerContentService } from './player-content.service';

describe('PlayerContentService', () => {
  let service: PlayerContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
