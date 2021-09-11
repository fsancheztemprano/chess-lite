import { TestBed } from '@angular/core/testing';
import { stubServiceLogsServiceProvider } from '../services/service-logs.service.stub';

import { ServiceLogsResolver } from './service-logs.resolver';

describe('ServiceLogsResolver', () => {
  let resolver: ServiceLogsResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubServiceLogsServiceProvider],
    });
    resolver = TestBed.inject(ServiceLogsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
