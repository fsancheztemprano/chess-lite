import { Injectable } from '@angular/core';
import {
  AuthRelations,
  CurrentUserRelations,
  Session,
  TOKEN_KEY,
  User,
  UserChangedMessage,
  UserChangedMessageAction,
  UserPreferences,
  UserPreferencesChangedMessage,
  WEBSOCKET_REL,
} from '@app/ui/shared/domain';
import { HalFormService, Link, Resource } from '@hal-form-client';
import { Actions } from '@ngneat/effects-ng';
import jwt_decode from 'jwt-decode';
import { catchError, EMPTY, filter, Observable, of, Subscription, tap, timer } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { updateSession } from '../store/session/session.action';
import { SessionRepository } from '../store/session/session.repository';
import { isTokenExpired, Token } from '../utils/auth.utils';
import { httpToSession } from '../utils/session.utils';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private userPreferencesUpdates?: Subscription;
  private userUpdates?: Subscription;
  private tokenWatchdog?: Subscription;
  private serviceWatchdog?: Subscription;

  constructor(
    private readonly messageService: MessageService,
    private readonly halFormService: HalFormService,
    private readonly sessionRepository: SessionRepository,
    private readonly actions: Actions,
  ) {
    SessionService._validateToken(localStorage.getItem(TOKEN_KEY));
  }

  private static _validateToken(token: string | null): boolean {
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem(TOKEN_KEY);
      return false;
    }
    return true;
  }

  public initialize(options?: Session): Observable<Resource> {
    const token: string | null = options?.token || localStorage.getItem(TOKEN_KEY);
    if (SessionService._validateToken(token)) {
      return this.messageService.disconnect().pipe(
        tap(() => localStorage.setItem(TOKEN_KEY, token!)),
        switchMap(() => this._initializeRoot()),
        switchMap(() =>
          options?.user
            ? of(options.user).pipe(tap((user: User) => this.actions.dispatch(updateSession({ user }))))
            : this._fetchUser(),
        ),
        tap((user) => {
          this._subscribeToUserChanges(user);
          this._subscribeToUserPreferencesChanges(new UserPreferences(user.userPreferences!));
          this._tokenWatchdog(token!);
        }),
        catchError(() => this.clearSession()),
      );
    } else return this._initializeRoot();
  }

  public clearSession(): Observable<Resource> {
    return this.messageService.disconnect().pipe(
      tap(() => {
        this.tokenWatchdog?.unsubscribe();
        this.userUpdates?.unsubscribe();
        this.userPreferencesUpdates?.unsubscribe();
        this.actions.dispatch(updateSession({}));
        localStorage.removeItem(TOKEN_KEY);
      }),
      switchMap(() => this._initializeRoot()),
    );
  }

  private _initializeRoot(): Observable<Resource> {
    return this.halFormService.initialize().pipe(
      tap(() => this.messageService.connect()),
      catchError(() => {
        this.serviceWatchdog?.unsubscribe();
        this.serviceWatchdog = timer(new Date(Date.now() + 6000))
          .pipe(switchMap(() => this.initialize()))
          .subscribe(() => this.serviceWatchdog?.unsubscribe());
        return EMPTY;
      }),
    );
  }

  private _tokenWatchdog(token: string): void {
    this.tokenWatchdog?.unsubscribe();
    const decoded: Token = jwt_decode<Token>(token);
    const minNextUpdate: number = Date.now() + 3000;
    const maxNextUpdate: number = (decoded.exp - 1) * 1000;
    const threshold: number = (decoded.exp - (decoded.exp - decoded.iat) * 0.1) * 1000;

    let nextUpdate: Date | null = new Date(minNextUpdate);
    if (minNextUpdate > maxNextUpdate) {
      nextUpdate = null;
    } else if (minNextUpdate < threshold) {
      nextUpdate = new Date(threshold);
    }

    this.tokenWatchdog = (
      nextUpdate
        ? timer(nextUpdate).pipe(
            switchMap(() => this.halFormService.getLinkOrThrow(AuthRelations.TOKEN_RELATION).pipe(first())),
            switchMap((link: Link) => link.fetch<User>()),
            map(httpToSession),
            switchMap((session) => this.initialize(session)),
            catchError(() => this.clearSession()),
          )
        : this.clearSession()
    ).subscribe();
  }

  private _fetchUser(): Observable<User> {
    return this.halFormService.getLinkOrThrow(CurrentUserRelations.CURRENT_USER_REL).pipe(
      first(),
      switchMap((userLink) => userLink.follow()),
      tap((user: User) => this.actions.dispatch(updateSession({ user }))),
    );
  }

  private _fetchUserPreferences(): Observable<UserPreferences> {
    return this.sessionRepository.user$.pipe(
      first(),
      switchMap(
        (user: User | undefined) => user?.getLinkOrThrow(CurrentUserRelations.USER_PREFERENCES_REL).follow() || EMPTY,
      ),
      tap((userPreferences: UserPreferences) => this.actions.dispatch(updateSession({ userPreferences }))),
    );
  }

  private _subscribeToUserChanges(user: User) {
    this.userUpdates?.unsubscribe();
    if (user.hasLink(WEBSOCKET_REL)) {
      this.userUpdates = this.messageService
        .subscribeToMessages<UserChangedMessage>(user.getLink(WEBSOCKET_REL)!.href)
        .pipe(
          filter((message: UserChangedMessage) => message.action !== UserChangedMessageAction.CREATED),
          switchMap((message: UserChangedMessage) =>
            message.action === UserChangedMessageAction.DELETED ? this.clearSession() : this._fetchUser(),
          ),
        )
        .subscribe();
    }
  }

  private _subscribeToUserPreferencesChanges(userPreferences: UserPreferences) {
    this.userPreferencesUpdates?.unsubscribe();
    if (userPreferences.hasLink(WEBSOCKET_REL)) {
      this.userPreferencesUpdates = this.messageService
        .subscribeToMessages<UserPreferencesChangedMessage>(userPreferences.getLink(WEBSOCKET_REL)!.href)
        .pipe(switchMap(() => this._fetchUserPreferences()))
        .subscribe();
    }
  }
}
