import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  ActivationTokenRelations,
  ManageUserProfileInput,
  User,
  UserChangedMessage,
  UserChangedMessageAction,
  UserChangedMessageDestination,
  UserManagementRelations,
  UserPreferences,
} from '@app/domain';
import { BehaviorSubject, EMPTY, first, Observable, Subscription, switchMap, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { MessageService } from '../../../../../../../core/services/message.service';
import { ToasterService } from '../../../../../../../core/services/toaster.service';
import { filterNulls } from '../../../../../../../shared/utils/forms/rxjs/filter-null.rxjs.pipe';
import { UserManagementService } from '../../../services/user-management.service';

@Injectable({
  providedIn: 'root',
})
export class UserManagementDetailService {
  private _user: BehaviorSubject<User> = new BehaviorSubject<User>(new User({}));

  private _userChanges = new Subscription();

  constructor(
    private readonly userManagementService: UserManagementService,
    private readonly messageService: MessageService,
    private readonly router: Router,
    private readonly toasterService: ToasterService,
  ) {}

  public fetchUser(userId: string) {
    return this.userManagementService.fetchUser(userId);
  }

  public initialize(userId: string): Observable<User> {
    this._userChanges.unsubscribe();
    return this._initializeUser(userId).pipe(tap(() => this._subscribeToUserChanges(userId)));
  }

  public deactivate(): void {
    this._userChanges.unsubscribe();
    this.setUser(new User({}));
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

  canUpdateRole(): Observable<boolean> {
    return this.getUser().pipe(map((user) => user.isAllowedTo(UserManagementRelations.USER_UPDATE_ROLE_REL)));
  }

  canUpdateAuthorities(): Observable<boolean> {
    return this.getUser().pipe(map((user) => user.isAllowedTo(UserManagementRelations.USER_UPDATE_AUTHORITIES_REL)));
  }

  updateProfile(body: ManageUserProfileInput) {
    return this.getUser().pipe(
      first(),
      filterNulls(),
      switchMap((user) => user.submitToTemplateOrThrow(UserManagementRelations.USER_UPDATE_REL, { body })),
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

  fetchUserPreferences(): Observable<UserPreferences> {
    return this.getUser().pipe(
      first(),
      filterNulls(),
      switchMap((user) => user.getLinkOrThrow(UserManagementRelations.USER_PREFERENCES_REL).follow()),
    );
  }

  updateUserPreferences(userPreferences: UserPreferences, body: UserPreferences): Observable<UserPreferences> {
    return userPreferences.submitToTemplateOrThrow(UserManagementRelations.USER_UPDATE_REL, { body });
  }

  private _initializeUser(userId: string): Observable<User> {
    return this.fetchUser(userId).pipe(
      tap((user) => {
        this.setUser(user);
      }),
    );
  }

  private _subscribeToUserChanges(userId: string) {
    this._userChanges = this.messageService
      .subscribeToMessages<UserChangedMessage>(new UserChangedMessageDestination(userId))
      .pipe(
        switchMap((userChangedEvent) => {
          if (userChangedEvent.action === UserChangedMessageAction.UPDATED) {
            return this._initializeUser(userChangedEvent.userId).pipe(
              tap((user) => this.toasterService.showToast({ title: `User ${user.username} has received an update.` })),
            );
          } else {
            this.toasterService.showToast({ title: `User account ${userChangedEvent.userId} was removed.` });
            this.router.navigate(['user-management']);
            return EMPTY;
          }
        }),
      )
      .subscribe();
  }
}
