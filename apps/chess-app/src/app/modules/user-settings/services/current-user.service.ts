import { Injectable } from '@angular/core';
import { CurrentUserRelations, User, UserChangePasswordInput, UserUpdateProfileInput } from '@chess-lite/domain';
import { HalFormService, submitToTemplateOrThrowPipe } from '@chess-lite/hal-form-client';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CurrentUserService {
  constructor(private readonly halFormsService: HalFormService, private readonly authService: AuthService) {}

  public hasCurrentUserLink(): Observable<boolean> {
    return this.halFormsService.hasLink(CurrentUserRelations.CURRENT_USER_REL);
  }

  public getCurrentUser(): Observable<User | null> {
    return this.authService.user$;
  }

  public getCurrentUsername(): Observable<string | null> {
    return this.authService.getCurrentUsername();
  }

  public isAllowedToUpdateProfile(user: User): boolean {
    return user.isAllowedTo(CurrentUserRelations.UPDATE_PROFILE_REL);
  }

  public updateProfile(user$: Observable<User>, updateUserProfileInput: UserUpdateProfileInput): Observable<User> {
    return user$.pipe(
      submitToTemplateOrThrowPipe(CurrentUserRelations.UPDATE_PROFILE_REL, updateUserProfileInput),
      this.authService.setUserPipe(),
    );
  }

  public isAllowedToDeleteAccount(user: User): boolean {
    return user.isAllowedTo(CurrentUserRelations.DELETE_ACCOUNT_REL);
  }

  public deleteAccount(user$: Observable<User>): Observable<void> {
    return user$.pipe(
      submitToTemplateOrThrowPipe(CurrentUserRelations.DELETE_ACCOUNT_REL),
      tap(() => this.authService.clearLocalSession()),
    );
  }

  public isAllowedToChangePassword(user: User): boolean {
    return user.isAllowedTo(CurrentUserRelations.CHANGE_PASSWORD_REL);
  }

  changePassword(user$: Observable<User>, userChangePasswordInput: UserChangePasswordInput): Observable<User> {
    return user$.pipe(submitToTemplateOrThrowPipe(CurrentUserRelations.CHANGE_PASSWORD_REL, userChangePasswordInput));
  }

  isAllowedToUploadAvatar(user: User): boolean {
    return user.isAllowedTo(CurrentUserRelations.UPLOAD_AVATAR_REL);
  }

  uploadAvatar(user$: Observable<User>, file: File): Observable<User> {
    const formData = new FormData();
    formData.append('avatar', file);
    return user$.pipe(
      submitToTemplateOrThrowPipe(CurrentUserRelations.UPLOAD_AVATAR_REL, formData),
      this.authService.setUserPipe(),
    );
  }
}
