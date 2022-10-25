import { Injectable } from '@angular/core';
import { Pageable, User, UserInput, UserManagementRelations, UserPage } from '@app/ui/shared/domain';
import { AdministrationService } from '@app/ui/shared/feature/administration';
import { HalFormResourceService, Link } from '@hal-form-client';
import { Observable } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserManagementService extends HalFormResourceService {
  constructor(private readonly administrationService: AdministrationService) {
    super();
    this.administrationService
      .getEmbeddedObject(UserManagementRelations.USER_MANAGEMENT_REL)
      .subscribe((resource) => this.setResource(resource));
  }

  public fetchUsers(pageable?: Pageable): Observable<UserPage> {
    return this.getLinkOrThrow(UserManagementRelations.USERS_REL).pipe(
      first(),
      switchMap((link: Link) => link.follow<UserPage>({ parameters: { ...pageable } })),
    );
  }

  public fetchUser(userId: string): Observable<User> {
    userId = userId || '0';
    return this.getLinkOrThrow(UserManagementRelations.USER_REL).pipe(
      first(),
      switchMap((userLink) => userLink.follow({ parameters: { userId } })),
    );
  }

  public createUser(body: UserInput): Observable<User> {
    return this.resourceOnce$.pipe(
      switchMap((resource) => resource.getTemplateOrThrow(UserManagementRelations.USER_CREATE_REL).submit({ body })),
    );
  }
}
