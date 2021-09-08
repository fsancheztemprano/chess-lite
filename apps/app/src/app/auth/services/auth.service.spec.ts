import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HalFormClientTestingModule } from '@hal-form-client/testing';
import { stubPreferencesServiceProvider } from '../../core/services/preferences.service.stub';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HalFormClientTestingModule],
      providers: [stubPreferencesServiceProvider],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
