import { TestBed } from '@angular/core/testing';
import { stubCurrentUserServiceProvider } from '../../../services/current-user.service.stub';

import { CurrentUserPreferencesService } from './current-user-preferences.service';

describe('UserPreferencesService', () => {
  let service: CurrentUserPreferencesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubCurrentUserServiceProvider],
    });
    service = TestBed.inject(CurrentUserPreferencesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
