import { TestBed } from '@angular/core/testing';
import { stubCurrentUserServiceProvider } from '../../../services/current-user.service.stub';
import { CurrentUserPreferencesResolver } from './current-user-preferences.resolver';

describe('CurrentUserPreferencesResolver', () => {
  let resolver: CurrentUserPreferencesResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubCurrentUserServiceProvider],
    });
    resolver = TestBed.inject(CurrentUserPreferencesResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
