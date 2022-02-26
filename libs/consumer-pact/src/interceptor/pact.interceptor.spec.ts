import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PACT_BASE_URL, PactInterceptor, PactInterceptorProvider } from './pact.interceptor';

describe('PactInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PactInterceptor,
        {
          provide: PACT_BASE_URL,
          useValue: 'http://localhost:1234',
        },
        PactInterceptorProvider,
      ],
    });
  });

  it('should be created', () => {
    const interceptor: PactInterceptor = TestBed.inject(PactInterceptor);
    expect(interceptor).toBeTruthy();
  });

  it('should intercept a call and set the hostname, port and baseurl', () => {
    const http: HttpClient = TestBed.inject(HttpClient);
    const httpTestingController: HttpTestingController = TestBed.inject(HttpTestingController);

    http.get('/api/test').subscribe();
    httpTestingController.match('http://localhost:1234/api/test');
    http.get('api/test').subscribe();
    httpTestingController.match('http://localhost:1234/api/test');

    httpTestingController.verify();
  });
});
