import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { filterNulls, MessageService, ToasterService } from '@app/ui/shared/app';
import {
  ActivationTokenRelations,
  IUserPreferences,
  ManageUserProfileInput,
  User,
  UserChangedMessage,
  UserChangedMessageAction,
  UserManagementRelations,
  UserPreferences,
  WEBSOCKET_REL,
} from '@app/ui/shared/domain';
import { BehaviorSubject, EMPTY, first, Observable, Subscription, switchMap, tap } from 'rxjs';
import { map } from 'rxjs/operators';
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

  public initialize(userId: string): Observable<User> {
    return this._fetchUser(userId).pipe(tap((user) => this._subscribeToUserChanges(user)));
  }

  public tearDown(): void {
    this._userChanges?.unsubscribe();
    this.setUser(new User({}));
  }

  public get user$(): Observable<User> {
    return this._user.asObservable();
  }

  public setUser(user: User): void {
    this._user.next(user);
  }

  public canUpdateProfile(): Observable<boolean> {
    return this.user$.pipe(map((user) => user.hasTemplate(UserManagementRelations.USER_UPDATE_REL)));
  }

  public canUpdateRole(): Observable<boolean> {
    return this.user$.pipe(map((user) => user.hasTemplate(UserManagementRelations.USER_UPDATE_ROLE_REL)));
  }

  public canUpdateAuthorities(): Observable<boolean> {
    return this.user$.pipe(map((user) => user.hasTemplate(UserManagementRelations.USER_UPDATE_AUTHORITIES_REL)));
  }

  public updateUser(body: ManageUserProfileInput) {
    return this.user$.pipe(
      first(),
      filterNulls(),
      switchMap((user) => user.submitToTemplateOrThrow(UserManagementRelations.USER_UPDATE_REL, { body })),
    );
  }

  public updateUserRole(roleId: string) {
    return this.user$.pipe(
      first(),
      filterNulls(),
      switchMap((user) =>
        user.submitToTemplateOrThrow(UserManagementRelations.USER_UPDATE_ROLE_REL, { body: { roleId } }),
      ),
    );
  }

  public updateUserAuthorities(authorityIds: string[]) {
    return this.user$.pipe(
      first(),
      filterNulls(),
      switchMap((user) =>
        user.submitToTemplateOrThrow(UserManagementRelations.USER_UPDATE_AUTHORITIES_REL, { body: { authorityIds } }),
      ),
    );
  }

  public canDeleteAccount(): Observable<boolean> {
    return this.user$.pipe(map((user) => user.hasTemplate(UserManagementRelations.USER_DELETE_REL)));
  }

  public deleteUser(): Observable<unknown> {
    return this.user$.pipe(
      first(),
      filterNulls(),
      switchMap((user) => user.submitToTemplateOrThrow(UserManagementRelations.USER_DELETE_REL)),
    );
  }

  public canSendActivationToken(): Observable<boolean> {
    return this.user$.pipe(map((user) => user.hasTemplate(ActivationTokenRelations.REQUEST_ACTIVATION_TOKEN_REL)));
  }

  public sendActivationToken(): Observable<unknown> {
    return this.user$.pipe(
      first(),
      filterNulls(),
      switchMap((user) => user.submitToTemplateOrThrow(ActivationTokenRelations.REQUEST_ACTIVATION_TOKEN_REL)),
    );
  }

  public fetchUserPreferences(): Observable<UserPreferences> {
    return this.user$.pipe(
      first(),
      filterNulls(),
      switchMap((user) => user.getLinkOrThrow(UserManagementRelations.USER_PREFERENCES_REL).follow()),
    );
  }

  public updateUserPreferences(userPreferences: UserPreferences, body: IUserPreferences): Observable<UserPreferences> {
    return userPreferences.submitToTemplateOrThrow(UserManagementRelations.USER_UPDATE_REL, { body });
  }

  private _fetchUser(userId: string): Observable<User> {
    return this.userManagementService.fetchUser(userId).pipe(
      tap((user) => {
        this.setUser(user);
      }),
    );
  }

  private _subscribeToUserChanges(user: User): void {
    this._userChanges?.unsubscribe();
    if (user.hasLink(WEBSOCKET_REL)) {
      this._userChanges = this.messageService
        .multicast<UserChangedMessage>(user.getLink(WEBSOCKET_REL)!.href)
        .pipe(
          switchMap((userChangedEvent) => {
            if (userChangedEvent.action === UserChangedMessageAction.UPDATED) {
              return this._fetchUser(userChangedEvent.userId);
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
}
