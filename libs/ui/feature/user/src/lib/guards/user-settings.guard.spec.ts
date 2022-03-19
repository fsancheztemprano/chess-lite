import { TestBed } from '@angular/core/testing';
import { stubUserSettingsServiceProvider } from '../services/user-settings.service.stub';
import { UserSettingsGuard } from './user-settings.guard';

describe('UserSettingsGuard', () => {
  let guard: UserSettingsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubUserSettingsServiceProvider],
    });
    guard = TestBed.inject(UserSettingsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
