import { Injectable } from '@angular/core';
import { AdministrationRelations, ServiceLogs } from '@app/domain';
import { Observable } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { AdministrationService } from '../../../services/administration.service';

@Injectable({
  providedIn: 'root',
})
export class ServiceLogsService {
  constructor(private readonly administrationService: AdministrationService) {}

  public getServiceLogs(): Observable<ServiceLogs> {
    return this.administrationService.getLinkOrThrow(AdministrationRelations.SERVICE_LOGS_REL).pipe(
      first(),
      switchMap((link) => link.follow()),
    );
  }
}
