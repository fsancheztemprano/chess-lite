import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pageable, UserPage } from '@chess-lite/domain';
import { HalFormService, Link, noLinkError, Resource } from '@chess-lite/hal-form-client';
import { iif, Observable, of, throwError } from 'rxjs';
import { first, map, switchMap, tap } from 'rxjs/operators';
import { AdministrationService } from '../../../services/administration.service';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService extends HalFormService {
  public readonly USER_MANAGEMENT_REL = 'user-management';
  public readonly USERS_REL = 'users';
  public readonly USER_MODEL_LIST_REL = 'userModelList';

  constructor(
    protected readonly httpClient: HttpClient,
    private readonly administrationService: AdministrationService,
  ) {
    super(httpClient, '');
  }

  initialize(): Observable<Resource> {
    return this.administrationService.rootResource.pipe(
      switchMap((administrationResource) => {
        return iif(
          () => administrationResource.hasEmbeddedObject(this.USER_MANAGEMENT_REL),
          of(administrationResource.getEmbeddedObject<Resource>(this.USER_MANAGEMENT_REL)),
          throwError(() => new Error('User Management Initialization Error')),
        );
      }),
      tap((resource) => this.setRootResource(resource)),
    );
  }

  public findUsers(pageable?: Pageable): Observable<UserPage> {
    return this.getLink(this.USERS_REL).pipe(
      first(),
      switchMap((link: Link | null) => {
        return link ? link.get(pageable) : noLinkError(this.USERS_REL);
      }),
      map((resource: Resource) => ({
        userModelList: resource.getEmbeddedCollection(this.USER_MODEL_LIST_REL),
        page: resource.page,
      })),
    );
  }
}
