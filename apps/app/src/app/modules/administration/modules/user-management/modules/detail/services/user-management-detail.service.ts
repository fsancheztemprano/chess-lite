import { Injectable } from '@angular/core';
import { ActivationTokenRelations, ManageUserProfileInput, User, UserManagementRelations } from '@app/domain';
import { Resource } from '@hal-form-client';
import { BehaviorSubject, first, Observable, switchMap, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { filterNulls } from '../../../../../../../shared/utils/forms/rxjs/filter-null.rxjs.pipe';
import { UserManagementService } from '../../../services/user-management.service';

@Injectable({
  providedIn: 'root',
})
export class UserManagementDetailService {
  private _user: BehaviorSubject<User> = new BehaviorSubject<User>(new Resource({}));

  constructor(private readonly userManagementService: UserManagementService) {}

  public initializeUser(userId: string): Observable<User> {
    return this.userManagementService.findUser(userId).pipe(tap((user) => this.setUser(user)));
  }

  getUser(): Observable<User> {
    return this._user.asObservable();
  }

  setUser(user: User): void {
    this._user.next(user);
  }

  canUpdateProfile(): Observable<boolean> {
    return this.getUser().pipe(map((user) => user.isAllowedTo(UserManagementRelations.USER_UPDATE_REL)));
  }

  updateProfile(profileInput: ManageUserProfileInput) {
    return this.getUser().pipe(
      first(),
      filterNulls(),
      switchMap((user) => user.submitToTemplateOrThrow(UserManagementRelations.USER_UPDATE_REL, profileInput)),
    );
  }

  canDeleteAccount(): Observable<boolean> {
    return this.getUser().pipe(map((user) => user.isAllowedTo(UserManagementRelations.USER_DELETE_REL)));
  }

  deleteProfile() {
    return this.getUser().pipe(
      first(),
      filterNulls(),
      switchMap((user) => user.submitToTemplateOrThrow(UserManagementRelations.USER_DELETE_REL)),
    );
  }

  canSendActivationToken(): Observable<boolean> {
    return this.getUser().pipe(map((user) => user.isAllowedTo(ActivationTokenRelations.REQUEST_ACTIVATION_TOKEN_REL)));
  }

  sendActivationToken() {
    return this.getUser().pipe(
      first(),
      filterNulls(),
      switchMap((user) => user.submitToTemplateOrThrow(ActivationTokenRelations.REQUEST_ACTIVATION_TOKEN_REL)),
    );
  }
}
