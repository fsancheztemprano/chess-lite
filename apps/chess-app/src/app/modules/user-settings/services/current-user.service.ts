import { Injectable } from '@angular/core';
import { DomainRelations, User, UserChangePasswordInput, UserUpdateProfileInput } from '@chess-lite/domain';
import { HalFormService, submitToTemplateOrThrowPipe } from '@chess-lite/hal-form-client';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CurrentUserService {
  public readonly CURRENT_USER_REL = DomainRelations.CURRENT_USER_REL;
  public readonly UPDATE_PROFILE_REL = DomainRelations.UPDATE_PROFILE_REL;
  public readonly CHANGE_PASSWORD_REL = DomainRelations.CHANGE_PASSWORD_REL;
  public readonly UPLOAD_AVATAR_REL = DomainRelations.UPLOAD_AVATAR_REL;
  public readonly DELETE_ACCOUNT_REL = DomainRelations.DELETE_ACCOUNT_REL;

  constructor(private readonly halFormsService: HalFormService, private readonly authService: AuthService) {}

  public hasCurrentUserLink(): Observable<boolean> {
    return this.halFormsService.hasLink(this.CURRENT_USER_REL);
  }

  public getCurrentUser(): Observable<User | null> {
    return this.authService.user$;
  }

  public getCurrentUsername(): Observable<string | null> {
    return this.authService.getCurrentUsername();
  }

  public isAllowedToUpdateProfile(user: User): boolean {
    return user.isAllowedTo(this.UPDATE_PROFILE_REL);
  }

  public updateProfile(user$: Observable<User>, updateUserProfileInput: UserUpdateProfileInput): Observable<User> {
    return user$.pipe(
      submitToTemplateOrThrowPipe(this.UPDATE_PROFILE_REL, updateUserProfileInput),
      this.authService.setUserPipe(),
    );
  }

  public isAllowedToDeleteAccount(user: User): boolean {
    return user.isAllowedTo(this.DELETE_ACCOUNT_REL);
  }

  public deleteAccount(user$: Observable<User>): Observable<void> {
    return user$.pipe(
      submitToTemplateOrThrowPipe(this.DELETE_ACCOUNT_REL),
      tap(() => this.authService.clearLocalSession()),
    );
  }

  public isAllowedToChangePassword(user: User): boolean {
    return user.isAllowedTo(this.CHANGE_PASSWORD_REL);
  }

  changePassword(user$: Observable<User>, userChangePasswordInput: UserChangePasswordInput): Observable<User> {
    return user$.pipe(submitToTemplateOrThrowPipe(this.CHANGE_PASSWORD_REL, userChangePasswordInput));
  }

  isAllowedToUploadAvatar(user: User): boolean {
    return user.isAllowedTo(this.UPLOAD_AVATAR_REL);
  }

  uploadAvatar(user$: Observable<User>, file: File): Observable<User> {
    const formData = new FormData();
    formData.append('avatar', file);
    return user$.pipe(submitToTemplateOrThrowPipe(this.UPLOAD_AVATAR_REL, formData), this.authService.setUserPipe());
  }
}
