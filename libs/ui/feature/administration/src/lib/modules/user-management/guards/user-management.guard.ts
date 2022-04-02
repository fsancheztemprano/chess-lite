import { Injectable } from '@angular/core';
import { CanActivate, CanLoad } from '@angular/router';
import { UserManagementRelations } from '@app/ui/shared/domain';
import { Observable } from 'rxjs';
import { AdministrationService } from '../../../services/administration.service';

@Injectable({
  providedIn: 'root',
})
export class UserManagementGuard implements CanLoad, CanActivate {
  constructor(private readonly administrationService: AdministrationService) {}

  canActivate(): Observable<boolean> {
    return this._guard();
  }

  canLoad(): Observable<boolean> {
    return this._guard();
  }

  private _guard(): Observable<boolean> {
    return this.administrationService.hasEmbeddedObject(UserManagementRelations.USER_MANAGEMENT_REL);
  }
}
