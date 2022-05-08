import { Injectable } from '@angular/core';
import { Pageable, Role, RoleManagementRelations, RolePage, RoleUpdateInput } from '@app/ui/shared/domain';
import { AdministrationService } from '@app/ui/shared/feature/administration';
import { HalFormResourceService, Link } from '@hal-form-client';
import { Observable } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RoleManagementService extends HalFormResourceService {
  constructor(private readonly administrationService: AdministrationService) {
    super();
    this.administrationService
      .getEmbeddedObject(RoleManagementRelations.ROLE_MANAGEMENT_REL)
      .subscribe((resource) => this.setResource(resource));
  }

  public fetchRoles(pageable?: Pageable): Observable<RolePage> {
    return this.getLinkOrThrow(RoleManagementRelations.ROLES_REL).pipe(
      first(),
      switchMap((link: Link) => link.follow<RolePage>({ parameters: { ...pageable } })),
    );
  }

  public fetchOneRole(roleId: string): Observable<Role> {
    return this.getLinkOrThrow(RoleManagementRelations.ROLE_REL).pipe(
      first(),
      switchMap((roleLink) => roleLink.follow({ parameters: { roleId } })),
    );
  }

  public updateRole(role: Role, body: RoleUpdateInput): Observable<Role> {
    return role.submitToTemplateOrThrow(RoleManagementRelations.ROLE_UPDATE_REL, { body });
  }

  public createRole(rolePage: RolePage, name: string): Observable<Role> {
    return rolePage.submitToTemplateOrThrow(RoleManagementRelations.ROLE_CREATE_REL, { body: { name } });
  }

  public deleteRole(role: Role): Observable<unknown> {
    return role.submitToTemplateOrThrow(RoleManagementRelations.ROLE_DELETE_REL);
  }
}
