import { TestBed } from '@angular/core/testing';
import { stubToasterServiceProvider } from '../services/toaster.service.stub';

import { GlobalErrorHandler } from './global-error-handler.service';

describe('GlobalErrorHandlerService', () => {
  let service: GlobalErrorHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubToasterServiceProvider],
    });
    service = TestBed.inject(GlobalErrorHandler);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
