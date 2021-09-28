import { Injectable } from '@angular/core';
import {
  CurrentUserRelations,
  User,
  UserChangedMessage,
  UserChangedMessageDestination,
  UserPreferences,
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

  private _userMessagesSubscription = new Subscription();

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

  public setCurrentUser(user: User | null): void {
    this._user.next(user);
  }

  public getCurrentUser(): Observable<User | null> {
    return this._user.asObservable();
  }

  public getCurrentUsername(): Observable<string | null> {
    return this.getCurrentUser().pipe(
      map((user) => {
        return user?.username || null;
      }),
    );
  }

  public fetchCurrentUserPreferences(user: User): Observable<UserPreferences> {
    return user.getLinkOrThrow(CurrentUserRelations.USER_PREFERENCES_REL).get();
  }

  public setUserPreferences(userPreferences: UserPreferences | null): void {
    this._userPreferences.next(userPreferences);
  }

  public getUserPreferences(): Observable<UserPreferences | null> {
    return this._userPreferences.asObservable();
  }

  public initializeUser(user: User) {
    this.setCurrentUser(user);
    this._subscribeToCurrentUserChanges(user.id as string);
    this.fetchCurrentUserPreferences(user).subscribe((userPreferences) =>
      this.preferencesService.setPreferences(userPreferences),
    );
  }

  clearUser() {
    this._userMessagesSubscription.unsubscribe();
    this.setCurrentUser(null);
    this.setUserPreferences(null);
    this.preferencesService.clearPreferences();
  }

  private _subscribeToCurrentUserChanges(userId: string) {
    this._userMessagesSubscription = this.messageService
      .connected$()
      .pipe(
        switchMap(() =>
          this.messageService.subscribeToMessages<UserChangedMessage>(new UserChangedMessageDestination(userId)),
        ),
        switchMap(() => this.fetchCurrentUser()),
      )
      .subscribe((user: User) => this.setCurrentUser(user));
  }
}
