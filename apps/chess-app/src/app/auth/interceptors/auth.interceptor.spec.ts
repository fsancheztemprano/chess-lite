import { TestBed } from '@angular/core/testing';
import { stubHalFormServiceProvider } from '@chess-lite/hal-form-client/testing';
import { stubAuthServiceProvider } from '../services/auth.service.stub';

import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [],
      providers: [AuthInterceptor, stubHalFormServiceProvider, stubAuthServiceProvider],
    }),
  );

  it('should be created', () => {
    const interceptor: AuthInterceptor = TestBed.inject(AuthInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
