import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { stubToasterServiceProvider, ToasterService, ToastType } from '@app/ui/shared/app';
import { HttpErrorInterceptor, HttpErrorInterceptorProvider } from './http-error.interceptor';

describe('HttpErrorInterceptor', () => {
  let interceptor: HttpErrorInterceptor;
  let httpTestingController: HttpTestingController;
  let http: HttpClient;
  let toasterService: ToasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpErrorInterceptor, HttpErrorInterceptorProvider, stubToasterServiceProvider],
    });
    interceptor = TestBed.inject(HttpErrorInterceptor);
    httpTestingController = TestBed.inject(HttpTestingController);
    toasterService = TestBed.inject(ToasterService);
    http = TestBed.inject(HttpClient);
  });

  afterEach(() => httpTestingController.verify());

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should intercept error and show generic error toast', (done) => {
    jest.spyOn(toasterService, 'showToast');
    http.get('/api/test').subscribe({
      error: () => {
        expect(toasterService.showToast).toHaveBeenCalledTimes(1);
        expect(toasterService.showToast).toHaveBeenCalledWith({ title: 'Bad Request', type: ToastType.ERROR });
        done();
      },
    });

    httpTestingController.expectOne('/api/test').flush(null, { status: 400, statusText: 'Bad Request' });
  });

  it('should intercept error and show message toast', (done) => {
    jest.spyOn(toasterService, 'showToast');
    http.get('/api/test').subscribe({
      error: () => {
        expect(toasterService.showToast).toHaveBeenCalledTimes(1);
        expect(toasterService.showToast).toHaveBeenCalledWith({
          title: 'Bad Request [400]',
          type: ToastType.ERROR,
          message: 'Title <br> Time',
          override: { enableHtml: true },
        });
        done();
      },
    });

    httpTestingController.expectOne('/api/test').flush(
      { title: 'Title', time: 'Time' },
      {
        status: 400,
        statusText: 'Bad Request',
      },
    );
  });
});
