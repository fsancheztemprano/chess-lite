import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pageable, Role, RoleManagementRelations, RolePage } from '@app/domain';
import { HalFormService, Link } from '@hal-form-client';
import { Observable, throwError } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { AdministrationService } from '../../../services/administration.service';

@Injectable({
  providedIn: 'root',
})
export class RoleManagementService extends HalFormService {
  constructor(
    protected readonly httpClient: HttpClient,
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
      switchMap((link: Link) => link.get<RolePage>(pageable)),
    );
  }

  public fetchAllRoles(): Observable<Role[]> {
    return this.fetchRoles({ size: 1000 }).pipe(
      map((resource) => resource.getEmbeddedCollection(RoleManagementRelations.ROLE_MODEL_LIST_REL)),
    );
  }

  public fetchOneRole(roleId: string): Observable<Role> {
    return roleId.length
      ? this.getLinkOrThrow(RoleManagementRelations.ROLE_REL).pipe(
          first(),
          switchMap((roleLink) => roleLink.get({ roleId })),
        )
      : throwError(() => `Invalid id ${roleId}`);
  }
}
