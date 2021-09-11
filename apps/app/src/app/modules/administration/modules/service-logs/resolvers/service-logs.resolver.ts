import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ServiceLogs } from '@app/domain';
import { Observable } from 'rxjs';
import { ServiceLogsService } from '../services/service-logs.service';

@Injectable({
  providedIn: 'root',
})
export class ServiceLogsResolver implements Resolve<ServiceLogs> {
  constructor(private readonly serviceLogsService: ServiceLogsService) {}

  resolve(): Observable<ServiceLogs> {
    return this.serviceLogsService.getServiceLogs();
  }
}
