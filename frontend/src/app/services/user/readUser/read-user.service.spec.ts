import { TestBed } from '@angular/core/testing';

import { ReadUserService } from './read-user.service';

describe('ReadUserService', () => {
  let service: ReadUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReadUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
