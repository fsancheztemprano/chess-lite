import { Injectable } from '@angular/core';
import { UpdateUserProfileInput, User } from '@chess-lite/domain';
import { Resource } from '@chess-lite/hal-form-client';
import { iif, Observable } from 'rxjs';
import { first, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../../../../auth/services/auth.service';
import { noLinkError, notAllowedError } from '../../../../core/utils/rxjs.utils';
import { UserRootService } from './user-root.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public readonly USER_REL = 'user';
  public readonly UPDATE_PROFILE_REL = 'updateProfile';
  public readonly DELETE_ACCOUNT_REL = 'delete';

  constructor(private readonly userRootService: UserRootService, private readonly authService: AuthService) {}

  public hasUserLink(): Observable<boolean> {
    return this.userRootService.hasLink(this.USER_REL);
  }

  public fetchCurrentUser(): Observable<User> {
    return this.authService.fetchCurrentUser();
  }

  public getCurrentUsername(): Observable<string | null> {
    return this.authService.getCurrentUsername();
  }

  public getUser(username: string): Observable<User> {
    return this.userRootService.getLink(this.USER_REL).pipe(
      first(),
      switchMap((userLink) => {
        return userLink ? userLink.get<User>({ username }) : noLinkError(this.USER_REL);
      }),
    );
  }

  public isAllowedToUpdateProfile(user: Resource): boolean {
    return user.isAllowedTo(this.UPDATE_PROFILE_REL);
  }

  public updateProfile(user$: Observable<Resource>, updateUserProfileInput: UpdateUserProfileInput): Observable<void> {
    return user$.pipe(
      switchMap((user) => {
        return iif(
          () => user?.isAllowedTo(this.UPDATE_PROFILE_REL),
          user
            .getAssuredTemplate(this.UPDATE_PROFILE_REL)
            .submit(updateUserProfileInput)
            .pipe(tap((updatedUser) => this.authService.setUser(updatedUser))),
          notAllowedError(this.UPDATE_PROFILE_REL),
        );
      }),
    );
  }

  public isAllowedToDeleteAccount(user: Resource): boolean {
    return user.isAllowedTo(this.DELETE_ACCOUNT_REL);
  }

  public deleteAccount(user$: Observable<Resource>): Observable<void> {
    return user$.pipe(
      switchMap((user) => {
        return iif(
          () => user?.isAllowedTo(this.DELETE_ACCOUNT_REL),
          user
            .getAssuredTemplate(this.DELETE_ACCOUNT_REL)
            .submit()
            .pipe(tap(() => this.authService.clearLocalSession())),
          notAllowedError(this.DELETE_ACCOUNT_REL),
        );
      }),
    );
  }
}
