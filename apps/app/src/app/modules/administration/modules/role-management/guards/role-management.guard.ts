import { Injectable } from '@angular/core';
import { CanActivate, CanLoad } from '@angular/router';
import { RoleManagementRelations } from '@app/domain';
import { Observable } from 'rxjs';
import { AdministrationService } from '../../../services/administration.service';

@Injectable({
  providedIn: 'root',
})
export class RoleManagementGuard implements CanLoad, CanActivate {
  constructor(private readonly administrationService: AdministrationService) {}

  canActivate(): Observable<boolean> {
    return this._guard();
  }

  canLoad(): Observable<boolean> {
    return this._guard();
  }

  private _guard(): Observable<boolean> {
    return this.administrationService.hasEmbeddedObject(RoleManagementRelations.ROLE_MANAGEMENT_REL);
  }
}
