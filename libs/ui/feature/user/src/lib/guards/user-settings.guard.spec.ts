import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HalFormClientModule } from '@hal-form-client';
import { UserSettingsGuard } from './user-settings.guard';

describe('UserSettingsGuard', () => {
  let guard: UserSettingsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HalFormClientModule, HttpClientTestingModule],
    });
    guard = TestBed.inject(UserSettingsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
