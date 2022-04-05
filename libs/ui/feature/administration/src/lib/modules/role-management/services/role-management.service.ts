import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pageable, Role, RoleManagementRelations, RolePage, RoleUpdateInput } from '@app/ui/shared/domain';
import { HalFormService, Link } from '@hal-form-client';
import { Observable } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { AdministrationService } from '../../../services/administration.service';

@Injectable({
  providedIn: 'root',
})
export class RoleManagementService extends HalFormService {
  constructor(
    protected override readonly httpClient: HttpClient,
    private readonly administrationService: AdministrationService,
  ) {
    super(httpClient, '');
    this.administrationService
      .getEmbeddedObject(RoleManagementRelations.ROLE_MANAGEMENT_REL)
      .subscribe((resource) => this.setRootResource(resource));
  }

  public fetchRoles(pageable?: Pageable): Observable<RolePage> {
    return this.getLinkOrThrow(RoleManagementRelations.ROLES_REL).pipe(
      first(),
      switchMap((link: Link) => link.follow<RolePage>(pageable)),
    );
  }

  public fetchOneRole(roleId: string): Observable<Role> {
    return this.getLinkOrThrow(RoleManagementRelations.ROLE_REL).pipe(
      first(),
      switchMap((roleLink) => roleLink.follow({ roleId })),
    );
  }

  public updateRole(role: Role, body: RoleUpdateInput): Observable<Role> {
    return role.submitToTemplateOrThrow(RoleManagementRelations.ROLE_UPDATE_REL, { body });
  }

  public createRole(rolePage: RolePage, name: string): Observable<Role> {
    return rolePage.submitToTemplateOrThrow(RoleManagementRelations.ROLE_CREATE_REL, { body: { name } });
  }

  deleteRole(role: Role): Observable<unknown> {
    return role.submitToTemplateOrThrow(RoleManagementRelations.ROLE_DELETE_REL);
  }
}
