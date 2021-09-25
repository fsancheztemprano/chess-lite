import { TestBed } from '@angular/core/testing';
import { stubUserSettingsServiceProvider } from '../../../services/user-settings.service.stub';
import { CurrentUserPreferencesResolver } from './current-user-preferences.resolver';

describe('CurrentUserPreferencesResolver', () => {
  let resolver: CurrentUserPreferencesResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubUserSettingsServiceProvider],
    });
    resolver = TestBed.inject(CurrentUserPreferencesResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
