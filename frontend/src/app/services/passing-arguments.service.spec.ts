import { TestBed } from '@angular/core/testing';

import { PassingArgumentsService } from './passing-arguments.service';

describe('PassingArgumentsService', () => {
  let service: PassingArgumentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PassingArgumentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
