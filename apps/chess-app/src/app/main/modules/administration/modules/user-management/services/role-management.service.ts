import { Injectable } from '@angular/core';
import { Role } from '@chess-lite/domain';
import { Link, noLinkError } from '@chess-lite/hal-form-client';
import { Observable } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { UserManagementService } from './user-management.service';

@Injectable({
  providedIn: 'root',
})
export class RoleManagementService {
  private readonly ROLES_REL = 'roles';
  private readonly ROLE_MODEL_LIST_REL = 'roleModelList';

  constructor(private readonly userManagementService: UserManagementService) {}

  public getAllRoles(): Observable<Role[]> {
    return this.userManagementService.getLink('roles').pipe(
      first(),
      switchMap((link: Link | null) =>
        link
          ? link.get({ size: 1000 }).pipe(map((resource) => resource.getEmbeddedCollection(this.ROLE_MODEL_LIST_REL)))
          : noLinkError(this.ROLES_REL),
      ),
    );
  }
}
