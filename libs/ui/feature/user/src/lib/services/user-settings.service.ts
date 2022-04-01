import { Injectable } from '@angular/core';
import {
  CurrentUserRelations,
  IUserPreferences,
  User,
  UserChangePasswordInput,
  UserPreferences,
  UserUpdateProfileInput,
} from '@app/domain';
import { clearSession, filterNulls } from '@app/ui/shared';
import { SessionRepository } from '@app/ui/store';
import { HalFormService, Resource, submitToTemplateOrThrowPipe } from '@hal-form-client';
import { Actions } from '@ngneat/effects-ng';
import { Observable } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsService {
  constructor(
    private readonly halFormsService: HalFormService,
    private readonly sessionRepository: SessionRepository,
    private readonly actions: Actions,
  ) {}

  public getCurrentUser(): Observable<User | null> {
    return this.sessionRepository.user$;
  }

  public getCurrentUserPreferences(): Observable<UserPreferences | null> {
    return this.sessionRepository.userPreferences$;
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
      tap((user) => this.sessionRepository.updateUser(user)),
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
      tap(() => this.actions.dispatch(clearSession())),
    );
  }

  public isAllowedToChangePassword(): Observable<boolean> {
    return this.getCurrentUser().pipe(
      map((user: User | null) => !!user?.isAllowedTo(CurrentUserRelations.CHANGE_PASSWORD_REL)),
    );
  }

  public changePassword(body: UserChangePasswordInput): Observable<User> {
    return this.getCurrentUser().pipe(
      first(),
      filterNulls(),
      submitToTemplateOrThrowPipe(CurrentUserRelations.CHANGE_PASSWORD_REL, { body }),
    );
  }

  public isAllowedToUploadAvatar(): Observable<boolean> {
    return this.getCurrentUser().pipe(
      map((user: User | null) => !!user?.isAllowedTo(CurrentUserRelations.UPLOAD_AVATAR_REL)),
    );
  }

  public uploadAvatar(file: File): Observable<User> {
    const body = new FormData();
    body.append('avatar', file);

    return this.getCurrentUser().pipe(
      first(),
      filterNulls(),
      submitToTemplateOrThrowPipe(CurrentUserRelations.UPLOAD_AVATAR_REL, { body }),
      tap((user) => this.sessionRepository.updateUser(user)),
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

  public isAllowedToUpdateUserPreferences(): Observable<boolean> {
    return this.getCurrentUserPreferences().pipe(
      map(
        (userPreferences: UserPreferences | null) =>
          !!userPreferences?.isAllowedTo(CurrentUserRelations.UPDATE_PREFERENCES_REL),
      ),
    );
  }
}
