import { Injectable } from '@angular/core';
import { CanMatch } from '@angular/router';
import { RoleManagementRelations } from '@app/ui/shared/domain';
import { AdministrationService } from '@app/ui/shared/feature/administration';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoleManagementGuard implements CanMatch {
  constructor(private readonly administrationService: AdministrationService) {}

  canMatch(): Observable<boolean> {
    return this._guard();
  }

  private _guard(): Observable<boolean> {
    return this.administrationService.hasEmbeddedObject(RoleManagementRelations.ROLE_MANAGEMENT_REL);
  }
}
