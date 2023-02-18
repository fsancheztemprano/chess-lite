import { Injectable } from '@angular/core';
import { CanMatch } from '@angular/router';
import { ServiceLogsRelations } from '@app/ui/shared/domain';
import { AdministrationService } from '@app/ui/shared/feature/administration';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceLogsGuard implements CanMatch {
  constructor(private readonly administrationService: AdministrationService) {}

  canMatch(): Observable<boolean> {
    return this._guard();
  }

  private _guard(): Observable<boolean> {
    return this.administrationService.hasLink(ServiceLogsRelations.SERVICE_LOGS_REL);
  }
}
