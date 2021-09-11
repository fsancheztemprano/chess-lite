import { Injectable } from '@angular/core';
import { ServiceLogsService } from './service-logs.service';

@Injectable({ providedIn: 'root' })
export class StubServiceLogsService implements Partial<ServiceLogsService> {}

export const stubServiceLogsServiceProvider = {
  provide: ServiceLogsService,
  useClass: StubServiceLogsService,
};
