import { TestBed } from '@angular/core/testing';
import { stubUserSettingsServiceProvider } from '../../../services/user-settings.service.stub';

import { CurrentUserPreferencesService } from './current-user-preferences.service';

describe('UserPreferencesService', () => {
  let service: CurrentUserPreferencesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubUserSettingsServiceProvider],
    });
    service = TestBed.inject(CurrentUserPreferencesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
