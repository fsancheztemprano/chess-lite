import { Injectable } from '@angular/core';
import {
  CurrentUserRelations,
  User,
  UserChangedMessage,
  UserChangedMessageDestination,
  UserPreferences,
  UserPreferencesChangedMessage,
  UserPreferencesChangedMessageDestination,
} from '@app/domain';
import { HalFormService } from '@hal-form-client';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { MessageService } from './message.service';
import { PreferencesService } from './preferences.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly _user = new BehaviorSubject<User | null>(null);
  private readonly _userPreferences = new BehaviorSubject<User | null>(null);

  private _subscription: Subscription = new Subscription();

  constructor(
    private readonly halFormService: HalFormService,
    private readonly messageService: MessageService,
    private readonly preferencesService: PreferencesService,
  ) {}

  public fetchCurrentUser(): Observable<User> {
    return this.halFormService.getLinkOrThrow(CurrentUserRelations.CURRENT_USER_REL).pipe(
      first(),
      switchMap((userLink) => userLink.get()),
    );
  }

  public setUser(user: User | null): void {
    this._user.next(user);
  }

  public getUser(): Observable<User | null> {
    return this._user.asObservable();
  }

  public getUsername(): Observable<string | null> {
    return this.getUser().pipe(
      map((user) => {
        return user?.username || null;
      }),
    );
  }

  public fetchUserPreferences(user: User): Observable<UserPreferences> {
    return user.getLinkOrThrow(CurrentUserRelations.USER_PREFERENCES_REL).get();
  }

  public setUserPreferences(userPreferences: UserPreferences | null): void {
    this._userPreferences.next(userPreferences);
    this.preferencesService.setPreferences(userPreferences);
  }

  public getUserPreferences(): Observable<UserPreferences | null> {
    return this._userPreferences.asObservable();
  }

  public initializeUser(user: User) {
    this.setUser(user);
    this._subscribeToUserChanges(user.id as string);
    this.fetchUserPreferences(user).subscribe((userPreferences) => {
      this.setUserPreferences(userPreferences);
      this._subscribeToUserPreferencesChanges(user);
    });
  }

  clearUser() {
    this._subscription.unsubscribe();
    this._subscription = new Subscription();
    this.setUser(null);
    this.setUserPreferences(null);
    this.preferencesService.clearPreferences();
  }

  private _subscribeToUserChanges(userId: string) {
    this._subscription.add(
      this.messageService
        .connected$()
        .pipe(
          switchMap(() =>
            this.messageService.subscribeToMessages<UserChangedMessage>(new UserChangedMessageDestination(userId)),
          ),
          switchMap(() => this.fetchCurrentUser()),
        )
        .subscribe((user: User) => this.setUser(user)),
    );
  }

  private _subscribeToUserPreferencesChanges(user: User) {
    this._subscription.add(
      this.messageService
        .connected$()
        .pipe(
          switchMap(() =>
            this.messageService.subscribeToMessages<UserPreferencesChangedMessage>(
              new UserPreferencesChangedMessageDestination(user.userPreferencesId || ''),
            ),
          ),
          switchMap(() => this.fetchUserPreferences(user)),
        )
        .subscribe((userPreferences: UserPreferences) => this.setUserPreferences(userPreferences)),
    );
  }
}
