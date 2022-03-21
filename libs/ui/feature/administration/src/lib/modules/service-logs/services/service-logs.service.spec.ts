import { TestBed } from '@angular/core/testing';
import { stubAdministrationServiceProvider } from '../../../services/administration.service.stub';
import { ServiceLogsService } from './service-logs.service';

describe('ServiceLogsService', () => {
  let service: ServiceLogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubAdministrationServiceProvider],
    });
    service = TestBed.inject(ServiceLogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
