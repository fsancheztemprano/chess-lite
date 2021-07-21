import { TestBed } from '@angular/core/testing';
import { stubUserServiceProvider } from '../services/user.service.stub';
import { UserGuard } from './user.guard';

describe('UserGuard', () => {
  let guard: UserGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubUserServiceProvider],
    });
    guard = TestBed.inject(UserGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
