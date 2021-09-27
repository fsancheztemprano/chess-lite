import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pageable, User, UserManagementRelations, UserPage } from '@app/domain';
import { HalFormService, Link, noLinkError, Resource, submitToTemplateOrThrowPipe } from '@hal-form-client';
import { iif, Observable, of, throwError } from 'rxjs';
import { first, switchMap, tap } from 'rxjs/operators';
import { AdministrationService } from '../../../services/administration.service';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService extends HalFormService {
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
          () => administrationResource.hasEmbeddedObject(UserManagementRelations.USER_MANAGEMENT_REL),
          of(administrationResource.getEmbeddedObject<Resource>(UserManagementRelations.USER_MANAGEMENT_REL)),
          throwError(() => new Error('User Management Initialization Error')),
        );
      }),
      tap((resource) => this.setRootResource(resource)),
    );
  }

  public findUsers(pageable?: Pageable): Observable<UserPage> {
    return this.getLink(UserManagementRelations.USERS_REL).pipe(
      first(),
      switchMap((link: Link | null) =>
        link ? (link.get(pageable) as Observable<UserPage>) : noLinkError(UserManagementRelations.USERS_REL),
      ),
    );
  }

  public createUser(user: User) {
    return this.rootResource.pipe(submitToTemplateOrThrowPipe(UserManagementRelations.USER_CREATE_REL, user));
  }

  public findUser(userId: string): Observable<User> {
    userId = userId || '0';
    return this.getLink(UserManagementRelations.USER_REL).pipe(
      first(),
      switchMap((userLink) => (userLink ? userLink.get({ userId }) : noLinkError(UserManagementRelations.USER_REL))),
    );
  }
}
