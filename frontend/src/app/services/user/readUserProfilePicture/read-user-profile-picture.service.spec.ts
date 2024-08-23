import { TestBed } from '@angular/core/testing';

import { ReadUserProfilePictureService } from './read-user-profile-picture.service';

describe('ReadUserProfilePictureService', () => {
  let service: ReadUserProfilePictureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReadUserProfilePictureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
