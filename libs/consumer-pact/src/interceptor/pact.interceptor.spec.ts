import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PACT_BASE_URL, PactInterceptor, PactInterceptorProvider } from './pact.interceptor';

describe('PactInterceptor', () => {
  let http: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PactInterceptor,
        {
          provide: PACT_BASE_URL,
          useValue: 'http://127.0.0.1:1234',
        },
        PactInterceptorProvider,
      ],
    });
    http = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  it('should be created', () => {
    const interceptor: PactInterceptor = TestBed.inject(PactInterceptor);
    expect(interceptor).toBeTruthy();
  });

  it.each(['/api/test', 'api/test', 'http://localhost/api/test'])(
    'should intercept a call to %s and set the hostname, port and baseurl',
    (url: string) => {
      http.get(url).subscribe();
      httpTestingController.match('http://127.0.0.1:1234/api/test');
    },
  );

  it('should intercept a call to ?param=value and set the hostname, port and baseurl', () => {
    http.get('?param=value').subscribe();
    httpTestingController.match('http://127.0.0.1:1234?param=value');
  });
});
