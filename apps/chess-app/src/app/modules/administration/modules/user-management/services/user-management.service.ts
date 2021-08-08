import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pageable, User, UserPage } from '@chess-lite/domain';
import { HalFormService, Link, noLinkError, Resource, submitToTemplateOrThrowPipe } from '@chess-lite/hal-form-client';
import { iif, Observable, of, throwError } from 'rxjs';
import { first, switchMap, tap } from 'rxjs/operators';
import { AdministrationService } from '../../../services/administration.service';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService extends HalFormService {
  public readonly USER_MANAGEMENT_REL = 'user-management';
  public readonly USER_REL = 'user';
  public readonly USERS_REL = 'users';
  public readonly USER_MODEL_LIST_REL = 'userModels';
  public readonly USER_CREATE_REL = 'create';
  public readonly UPDATE_REL = 'update';

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
      switchMap((link: Link | null) => (link ? link.get(pageable) : noLinkError(this.USERS_REL))),
    );
  }

  public createUser(user: User) {
    return this.rootResource.pipe(submitToTemplateOrThrowPipe(this.USER_CREATE_REL, user));
  }

  public findUser(userId: string): Observable<User> {
    return this.getLink(this.USER_REL).pipe(
      first(),
      switchMap((userLink) => (userLink ? userLink.get({ userId }) : noLinkError(this.USER_REL))),
    );
  }
}
