import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pageable, Role, RoleManagementRelations, RolePage } from '@app/domain';
import { HalFormService, Link, Resource } from '@hal-form-client';
import { Observable } from 'rxjs';
import { first, map, switchMap, tap } from 'rxjs/operators';
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
  }

  initialize(): Observable<Resource> {
    return this.administrationService.getResource().pipe(
      map((administrationResource) =>
        administrationResource.getEmbeddedObject(RoleManagementRelations.ROLE_MANAGEMENT_REL),
      ),
      tap((resource) => this.setRootResource(resource)),
    );
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
}
