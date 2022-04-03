import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ServiceLogsRelations } from '@app/ui/shared/domain';
import { Observable } from 'rxjs';
import { AdministrationService } from '../../../services/administration.service';

@Injectable({
  providedIn: 'root',
})
export class ServiceLogsGuard implements CanActivate {
  constructor(private readonly administrationService: AdministrationService) {}

  canActivate(): Observable<boolean> {
    return this._guard();
  }

  canLoad(): Observable<boolean> {
    return this._guard();
  }

  private _guard(): Observable<boolean> {
    return this.administrationService.hasLink(ServiceLogsRelations.SERVICE_LOGS_REL);
  }
}
