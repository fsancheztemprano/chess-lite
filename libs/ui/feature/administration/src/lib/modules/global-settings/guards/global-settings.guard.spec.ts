import { TestBed } from '@angular/core/testing';
import { stubGlobalSettingsServiceProvider } from '../services/global-settings.service.stub';

import { GlobalSettingsGuard } from './global-settings.guard';

describe('GlobalSettingsGuard', () => {
  let guard: GlobalSettingsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubGlobalSettingsServiceProvider],
    });
    guard = TestBed.inject(GlobalSettingsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
