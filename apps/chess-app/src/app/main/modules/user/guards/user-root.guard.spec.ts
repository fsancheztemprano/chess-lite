import { TestBed } from '@angular/core/testing';
import { stubUserRootServiceProvider } from '../services/user-root.service.stub';

import { UserRootGuard } from './user-root.guard';

describe('UserRootGuard', () => {
  let guard: UserRootGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubUserRootServiceProvider],
    });
    guard = TestBed.inject(UserRootGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
