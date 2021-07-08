import { TestBed } from '@angular/core/testing';
import { stubStubHalFormServiceProvider } from '@chess-lite/hal-form-client/testing';
import { stubStubAuthServiceProvider } from '../services/auth.service.stub';

import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [],
      providers: [AuthInterceptor, stubStubHalFormServiceProvider, stubStubAuthServiceProvider],
    })
  );

  it('should be created', () => {
    const interceptor: AuthInterceptor = TestBed.inject(AuthInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
