import { TestBed } from '@angular/core/testing';
import { HalFormClientTestingModule } from '@hal-form-client/testing';
import { stubMessageServiceProvider } from '../../core/services/message.service.stub';
import { stubPreferencesServiceProvider } from '../../core/services/preferences.service.stub';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HalFormClientTestingModule],
      providers: [stubPreferencesServiceProvider, stubMessageServiceProvider],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
