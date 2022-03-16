import { Injectable } from '@angular/core';
import {
  CurrentUserRelations,
  IUserPreferences,
  User,
  UserChangePasswordInput,
  UserPreferences,
  UserUpdateProfileInput,
} from '@app/domain';
import { HalFormService, Resource, submitToTemplateOrThrowPipe } from '@hal-form-client';
import { Observable, switchMap } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';
import { SessionService } from '../../../core/services/session.service';
import { UserService } from '../../../core/services/user.service';
import { filterNulls } from '../../../shared/utils/forms/rxjs/filter-null.rxjs.pipe';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsService {
  constructor(
    private readonly halFormsService: HalFormService,
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
  ) {}

  public hasCurrentUserLink(): Observable<boolean> {
    return this.halFormsService.hasLink(CurrentUserRelations.CURRENT_USER_REL);
  }

  public getCurrentUser(): Observable<User | null> {
    return this.userService.getUser();
  }

  public getCurrentUserPreferences(): Observable<UserPreferences | null> {
    return this.userService.getUserPreferences();
  }

  public isAllowedToUpdateProfile(): Observable<boolean> {
    return this.getCurrentUser().pipe(
      map((user: User | null) => !!user?.isAllowedTo(CurrentUserRelations.UPDATE_PROFILE_REL)),
    );
  }

  public updateProfile(body: UserUpdateProfileInput): Observable<User> {
    return this.getCurrentUser().pipe(
      first(),
      filterNulls(),
      submitToTemplateOrThrowPipe(CurrentUserRelations.UPDATE_PROFILE_REL, { body }),
      tap((user) => this.userService.setUser(user)),
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
      submitToTemplateOrThrowPipe(CurrentUserRelations.DELETE_ACCOUNT_REL),
      switchMap(() => this.sessionService.clearSession()),
    );
  }

  public isAllowedToChangePassword(): Observable<boolean> {
    return this.getCurrentUser().pipe(
      map((user: User | null) => !!user?.isAllowedTo(CurrentUserRelations.CHANGE_PASSWORD_REL)),
    );
  }

  changePassword(body: UserChangePasswordInput): Observable<User> {
    return this.getCurrentUser().pipe(
      first(),
      filterNulls(),
      submitToTemplateOrThrowPipe(CurrentUserRelations.CHANGE_PASSWORD_REL, { body }),
    );
  }

  isAllowedToUploadAvatar(): Observable<boolean> {
    return this.getCurrentUser().pipe(
      map((user: User | null) => !!user?.isAllowedTo(CurrentUserRelations.UPLOAD_AVATAR_REL)),
    );
  }

  uploadAvatar(file: File): Observable<User> {
    const body = new FormData();
    body.append('avatar', file);

    return this.getCurrentUser().pipe(
      first(),
      filterNulls(),
      submitToTemplateOrThrowPipe(CurrentUserRelations.UPLOAD_AVATAR_REL, { body }),
      tap((user) => this.userService.setUser(user)),
    );
  }

  public hasLinkToUserPreferences(): Observable<boolean> {
    return this.getCurrentUser().pipe(
      map((user: User | null) => !!user?.hasLink(CurrentUserRelations.USER_PREFERENCES_REL)),
    );
  }

  public updateUserPreferences(body: IUserPreferences): Observable<UserPreferences> {
    return this.getCurrentUserPreferences().pipe(
      first(),
      filterNulls(),
      submitToTemplateOrThrowPipe(CurrentUserRelations.UPDATE_PREFERENCES_REL, { body }),
    );
  }

  isAllowedToUpdateUserPreferences(): Observable<boolean> {
    return this.getCurrentUserPreferences().pipe(
      map(
        (userPreferences: UserPreferences | null) =>
          !!userPreferences?.isAllowedTo(CurrentUserRelations.UPDATE_PREFERENCES_REL),
      ),
    );
  }
}
