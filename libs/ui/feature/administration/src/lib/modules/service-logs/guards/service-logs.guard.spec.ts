import { TestBed } from '@angular/core/testing';
import { stubAdministrationServiceProvider } from '@app/ui/shared/feature/administration';

import { ServiceLogsGuard } from './service-logs.guard';

describe('ServiceLogsGuard', () => {
  let guard: ServiceLogsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubAdministrationServiceProvider],
    });
    guard = TestBed.inject(ServiceLogsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
