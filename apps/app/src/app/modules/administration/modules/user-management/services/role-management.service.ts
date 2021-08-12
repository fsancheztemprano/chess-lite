import { Injectable } from '@angular/core';
import { Role, RoleManagementRelations } from '@app/domain';
import { Link, noLinkError } from '@hal-form-client';
import { Observable } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { UserManagementService } from './user-management.service';

@Injectable({
  providedIn: 'root',
})
export class RoleManagementService {
  constructor(private readonly userManagementService: UserManagementService) {}

  public getAllRoles(): Observable<Role[]> {
    return this.userManagementService.getLink(RoleManagementRelations.ROLES_REL).pipe(
      first(),
      switchMap((link: Link | null) =>
        link
          ? link
              .get({ size: 1000 })
              .pipe(map((resource) => resource.getEmbeddedCollection(RoleManagementRelations.ROLE_MODEL_LIST_REL)))
          : noLinkError(RoleManagementRelations.ROLES_REL),
      ),
    );
  }
}
