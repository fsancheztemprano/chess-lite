import { TestBed } from '@angular/core/testing';
import { stubCurrentUserServiceProvider } from '../services/current-user.service.stub';
import { UserSettingsGuard } from './user-settings.guard';

describe('UserSettingsGuard', () => {
  let guard: UserSettingsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubCurrentUserServiceProvider],
    });
    guard = TestBed.inject(UserSettingsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
