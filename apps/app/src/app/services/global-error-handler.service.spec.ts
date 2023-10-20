import { TestBed } from '@angular/core/testing';
import { stubToasterServiceProvider } from '@app/ui/shared/app';
import { GlobalErrorHandler, GlobalErrorHandlerProvider } from './global-error-handler.service';

describe('GlobalErrorHandlerService', () => {
  let service: GlobalErrorHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalErrorHandler, GlobalErrorHandlerProvider, stubToasterServiceProvider],
    });
    service = TestBed.inject(GlobalErrorHandler);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show toast on error', () => {
    const spy = jest.spyOn(service['toasterService'], 'showToast');

    service.handleError(new Error('error-test'));

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      message: 'error-test',
      title: 'Error',
      type: 'toast-error',
    });
  });
});
