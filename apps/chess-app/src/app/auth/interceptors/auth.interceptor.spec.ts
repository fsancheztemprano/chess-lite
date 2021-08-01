import { TestBed } from '@angular/core/testing';
import { HalFormClientTestingModule } from '@chess-lite/hal-form-client/testing';
import { stubAuthServiceProvider } from '../services/auth.service.stub';

import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HalFormClientTestingModule],
      providers: [AuthInterceptor, stubAuthServiceProvider],
    }),
  );

  it('should be created', () => {
    const interceptor: AuthInterceptor = TestBed.inject(AuthInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
