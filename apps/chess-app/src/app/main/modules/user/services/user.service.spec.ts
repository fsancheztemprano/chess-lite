import { TestBed } from '@angular/core/testing';
import { stubUserRootServiceProvider } from './user-root.service.stub';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubUserRootServiceProvider],
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
