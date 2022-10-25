import { HttpClient, HttpContext, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TokenKeys, USE_REFRESH_TOKEN } from '@app/ui/shared/domain';
import { sign } from 'jsonwebtoken';
import { AuthInterceptor, AuthInterceptorProvider } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  let httpTestingController: HttpTestingController;
  let http: HttpClient;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthInterceptor, AuthInterceptorProvider],
    }),
  );

  beforeEach(() => {
    httpTestingController = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
    interceptor = TestBed.inject(AuthInterceptor);
  });

  afterEach(() => httpTestingController.verify());

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add valid token to header', (done) => {
    const token = sign({}, 'secret', { expiresIn: '10m' });
    localStorage.setItem(TokenKeys.TOKEN, token);

    http.get<{ result: string }>('/api').subscribe((value) => {
      expect(value.result === 'success');
      done();
    });

    httpTestingController
      .expectOne((request: HttpRequest<unknown>) => {
        return request.url === '/api' && request.headers.get('Authorization') === `Bearer ${token}`;
      })
      .flush({ result: 'success' });
  });

  it('should not add invalid token to header', (done) => {
    const token = sign({}, 'secret', { expiresIn: '-10m' });
    localStorage.setItem(TokenKeys.TOKEN, token);

    http.get<{ result: string }>('/api').subscribe((value) => {
      expect(value.result === 'success');
      done();
    });

    httpTestingController
      .expectOne((request: HttpRequest<unknown>) => {
        return request.url === '/api' && !request.headers.has('Authorization');
      })
      .flush({ result: 'success' });
  });

  it('should user refresh token given context config', () => {
    const token = sign({}, 'secret', { expiresIn: '10m' });
    const refreshToken = sign({}, 'secret', { expiresIn: '10m' });
    localStorage.setItem(TokenKeys.TOKEN, token);
    localStorage.setItem(TokenKeys.REFRESH_TOKEN, refreshToken);

    http
      .get<{ result: string }>('/api', { context: new HttpContext().set(USE_REFRESH_TOKEN, true) })
      .subscribe((value) => {
        expect(value.result === 'success');
      });

    httpTestingController
      .expectOne((request: HttpRequest<unknown>) => {
        return request.url === '/api' && request.headers.get('Authorization') === `Bearer ${refreshToken}`;
      })
      .flush({ result: 'success' });
  });
});
