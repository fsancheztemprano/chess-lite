import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pageable, User, UserInput, UserManagementRelations, UserPage } from '@app/ui/shared/domain';
import { HalFormService, Link } from '@hal-form-client';
import { Observable } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { AdministrationService } from '../../../services/administration.service';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService extends HalFormService {
  constructor(
    protected override readonly httpClient: HttpClient,
    private readonly administrationService: AdministrationService,
  ) {
    super(httpClient, '');
    this.administrationService
      .getEmbeddedObject(UserManagementRelations.USER_MANAGEMENT_REL)
      .subscribe((resource) => this.setResource(resource));
  }

  public fetchUsers(pageable?: Pageable): Observable<UserPage> {
    return this.getLinkOrThrow(UserManagementRelations.USERS_REL).pipe(
      first(),
      switchMap((link: Link) => link.follow<UserPage>(pageable)),
    );
  }

  public fetchUser(userId: string): Observable<User> {
    userId = userId || '0';
    return this.getLinkOrThrow(UserManagementRelations.USER_REL).pipe(
      first(),
      switchMap((userLink) => userLink.follow({ userId })),
    );
  }

  public createUser(body: UserInput): Observable<User> {
    return this.submitToTemplateOrThrow(UserManagementRelations.USER_CREATE_REL, { body });
  }
}
