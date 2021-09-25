import { Injectable } from '@angular/core';
import { CurrentUserRelations, User, UserChangePasswordInput, UserUpdateProfileInput } from '@app/domain';
import { HalFormService, Link, Resource, submitToTemplateOrThrowPipe } from '@hal-form-client';
import { filter, Observable, switchMap } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';
import { AuthService } from '../../../auth/services/auth.service';
import { filterNulls } from '../../../shared/utils/forms/rxjs/filter-null.rxjs.pipe';
import { isNonNull } from '../../../shared/utils/misc/is-non-null';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsService {
  constructor(private readonly halFormsService: HalFormService, private readonly authService: AuthService) {}

  public hasCurrentUserLink(): Observable<boolean> {
    return this.halFormsService.hasLink(CurrentUserRelations.CURRENT_USER_REL);
  }

  public getCurrentUser(): Observable<User | null> {
    return this.authService.getCurrentUser();
  }

  public isAllowedToUpdateProfile(): Observable<boolean> {
    return this.getCurrentUser().pipe(
      map((user: User | null) => !!user?.isAllowedTo(CurrentUserRelations.UPDATE_PROFILE_REL)),
    );
  }

  public updateProfile(updateUserProfileInput: UserUpdateProfileInput): Observable<User> {
    return this.getCurrentUser().pipe(
      first(),
      filterNulls(),
      submitToTemplateOrThrowPipe(CurrentUserRelations.UPDATE_PROFILE_REL, updateUserProfileInput),
      tap((user) => this.authService.setCurrentUser(user)),
    );
  }

  public isAllowedToDeleteAccount(): Observable<boolean> {
    return this.getCurrentUser().pipe(
      map((user: User | null) => !!user?.isAllowedTo(CurrentUserRelations.DELETE_ACCOUNT_REL)),
    );
  }

  public deleteAccount(): Observable<Resource> {
    return this.getCurrentUser().pipe(
      first(),
      filterNulls(),
      switchMap((user) => user.submitToTemplateOrThrow(CurrentUserRelations.DELETE_ACCOUNT_REL)),
      switchMap(() => this.authService.clearLocalSession()),
    );
  }

  public isAllowedToChangePassword(): Observable<boolean> {
    return this.getCurrentUser().pipe(
      map((user: User | null) => !!user?.isAllowedTo(CurrentUserRelations.CHANGE_PASSWORD_REL)),
    );
  }

  changePassword(userChangePasswordInput: UserChangePasswordInput): Observable<User> {
    return this.getCurrentUser().pipe(
      first(),
      filterNulls(),
      switchMap((user) =>
        user.submitToTemplateOrThrow(CurrentUserRelations.CHANGE_PASSWORD_REL, userChangePasswordInput),
      ),
    );
  }

  isAllowedToUploadAvatar(): Observable<boolean> {
    return this.getCurrentUser().pipe(
      map((user: User | null) => !!user?.isAllowedTo(CurrentUserRelations.UPLOAD_AVATAR_REL)),
    );
  }

  uploadAvatar(file: File): Observable<User> {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.getCurrentUser().pipe(
      first(),
      filter(isNonNull),
      switchMap((user) => user.submitToTemplateOrThrow(CurrentUserRelations.UPLOAD_AVATAR_REL, formData)),
      tap((user) => this.authService.setCurrentUser(user)),
    );
  }

  public hasLinkToUserPreferences(): Observable<boolean> {
    return this.getCurrentUser().pipe(
      map((user: User | null) => !!user?.hasLink(CurrentUserRelations.USER_PREFERENCES_REL)),
    );
  }

  public getLinkToUserPreferences(): Observable<Link | null> {
    return this.getCurrentUser().pipe(
      first(),
      map((user) => user?.getLink(CurrentUserRelations.USER_PREFERENCES_REL) || null),
    );
  }
}
