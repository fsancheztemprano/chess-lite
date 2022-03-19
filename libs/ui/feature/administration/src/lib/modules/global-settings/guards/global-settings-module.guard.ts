import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { GlobalSettingsRelations } from '@app/domain';
import { Observable } from 'rxjs';
import { AdministrationService } from '../../../services/administration.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalSettingsModuleGuard implements CanActivate {
  constructor(private readonly administrationService: AdministrationService) {}

  canActivate(): Observable<boolean> {
    return this._guard();
  }

  canLoad(): Observable<boolean> {
    return this._guard();
  }

  private _guard(): Observable<boolean> {
    return this.administrationService.hasLink(GlobalSettingsRelations.GLOBAL_SETTINGS_REL);
  }
}
