import { Injectable } from '@angular/core';
import { User, UserChangePasswordInput, UserUpdateProfileInput } from '@chess-lite/domain';
import { noLinkError, Resource, submitToTemplateOrThrowPipe } from '@chess-lite/hal-form-client';
import { Observable } from 'rxjs';
import { first, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../../../../auth/services/auth.service';
import { UserRootService } from './user-root.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public readonly USER_REL = 'user';
  public readonly UPDATE_PROFILE_REL = 'updateProfile';
  public readonly CHANGE_PASSWORD_REL = 'changePassword';
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

  public updateProfile(user$: Observable<Resource>, updateUserProfileInput: UserUpdateProfileInput): Observable<User> {
    return user$.pipe(
      submitToTemplateOrThrowPipe(this.UPDATE_PROFILE_REL, updateUserProfileInput),
      tap((updatedUser) => this.authService.setUser(updatedUser)),
    );
  }

  public isAllowedToDeleteAccount(user: Resource): boolean {
    return user.isAllowedTo(this.DELETE_ACCOUNT_REL);
  }

  public deleteAccount(user$: Observable<Resource>): Observable<void> {
    return user$.pipe(
      submitToTemplateOrThrowPipe(this.DELETE_ACCOUNT_REL),
      tap(() => this.authService.clearLocalSession()),
    );
  }

  public isAllowedToChangePassword(user: Resource): boolean {
    return user.isAllowedTo(this.CHANGE_PASSWORD_REL);
  }

  changePassword(user$: Observable<Resource>, userChangePasswordInput: UserChangePasswordInput): Observable<User> {
    return user$.pipe(submitToTemplateOrThrowPipe(this.CHANGE_PASSWORD_REL, userChangePasswordInput));
  }
}
