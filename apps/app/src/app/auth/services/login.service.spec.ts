import { TestBed } from '@angular/core/testing';
import { HalFormClientTestingModule } from '@hal-form-client/testing';
import { stubAuthServiceProvider } from './auth.service.stub';

import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HalFormClientTestingModule],
      providers: [stubAuthServiceProvider],
    });
    service = TestBed.inject(LoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
