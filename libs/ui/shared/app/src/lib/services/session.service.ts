import { HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AuthRelations,
  CurrentUserRelations,
  Session,
  TokenKeys,
  USE_REFRESH_TOKEN,
  User,
  UserChangedMessage,
  UserChangedMessageAction,
  UserPreferences,
  UserPreferencesChangedMessage,
  WEBSOCKET_REL,
} from '@app/ui/shared/domain';
import { HalFormService, Resource } from '@hal-form-client';
import { Actions } from '@ngneat/effects-ng';
import { jwtDecode } from 'jwt-decode';
import { catchError, EMPTY, filter, Observable, of, Subscription, tap, timer } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { updateSession } from '../store/session/session.action';
import { SessionRepository } from '../store/session/session.repository';
import { isValidToken, Token } from '../utils/auth.utils';
import { httpToSession } from '../utils/session.utils';
import { MessageService } from './message.service';

@Injectable({ providedIn: 'root' })
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
    this._validateToken(TokenKeys.TOKEN);
    this._validateToken(TokenKeys.REFRESH_TOKEN);
  }

  public initialize(session?: Session): Observable<Resource> {
    session ??= {};
    session.token ??= this._validateToken(TokenKeys.TOKEN);
    session.refreshToken ??= this._validateToken(TokenKeys.REFRESH_TOKEN);

    if (isValidToken(session.token)) {
      return this._initializeSession(session);
    } else if (isValidToken(session.refreshToken)) {
      return this._reanimateSession();
    } else return this._initializeRoot();
  }

  public clearSession(): Observable<Resource> {
    return this.messageService.disconnect().pipe(
      tap(() => {
        this.tokenWatchdog?.unsubscribe();
        this.userUpdates?.unsubscribe();
        this.userPreferencesUpdates?.unsubscribe();
        this.actions.dispatch(updateSession({}));
        localStorage.removeItem(TokenKeys.TOKEN);
        localStorage.removeItem(TokenKeys.REFRESH_TOKEN);
      }),
      switchMap(() => this._initializeRoot()),
    );
  }

  private _initializeSession(session: Session): Observable<User> {
    return this.messageService.disconnect().pipe(
      tap(() => {
        localStorage.setItem(TokenKeys.TOKEN, session.token!);
        localStorage.setItem(TokenKeys.REFRESH_TOKEN, session.refreshToken!);
      }),
      switchMap(() => this._initializeRoot()),
      switchMap(() =>
        session.user
          ? of(session.user).pipe(tap((user: User) => this.actions.dispatch(updateSession({ user }))))
          : this._fetchUser(),
      ),
      tap((user) => {
        this._subscribeToUserChanges(user);
        this._subscribeToUserPreferencesChanges(new UserPreferences(user.userPreferences));
        this._tokenWatchdog();
      }),
      catchError(() => this.clearSession()),
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

  private _refreshToken(resource: Resource): Observable<Resource> {
    return resource
      .getLinkOrThrow(AuthRelations.TOKEN_RELATION)
      .get<User>({ context: new HttpContext().set(USE_REFRESH_TOKEN, true) })
      .pipe(
        map(httpToSession),
        switchMap((session) => this.initialize(session)),
        catchError(() => this.clearSession()),
      );
  }

  private _reanimateSession(): Observable<Resource> {
    return this.halFormService
      .fetchRootResource({ context: new HttpContext().set(USE_REFRESH_TOKEN, true) })
      .pipe(switchMap((resource) => this._refreshToken(resource)));
  }

  private _tokenWatchdog(): void {
    this.tokenWatchdog?.unsubscribe();
    this.tokenWatchdog = undefined;
    const token = this._validateToken(TokenKeys.TOKEN);
    if (
      token &&
      this._validateToken(TokenKeys.REFRESH_TOKEN) &&
      this.halFormService.resource.hasLink(AuthRelations.TOKEN_RELATION)
    ) {
      const decoded: Token = jwtDecode<Token>(token);
      const minNextUpdate: number = Date.now() + 2000;
      const threshold: number = (decoded.exp - (decoded.exp - decoded.iat) * 0.1) * 1000;

      const nextUpdate: Date = new Date(minNextUpdate >= threshold ? minNextUpdate : threshold);

      this.tokenWatchdog = timer(nextUpdate)
        .pipe(
          switchMap(() => this.halFormService.resourceOnce$),
          switchMap((resource) => this._refreshToken(resource)),
        )
        .subscribe();
    }
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
    this.userUpdates = undefined;
    if (user.hasLink(WEBSOCKET_REL)) {
      this.userUpdates = this.messageService
        .multicast<UserChangedMessage>(user.getLink(WEBSOCKET_REL)!.href)
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
    this.userPreferencesUpdates = undefined;
    if (userPreferences.hasLink(WEBSOCKET_REL)) {
      this.userPreferencesUpdates = this.messageService
        .multicast<UserPreferencesChangedMessage>(userPreferences.getLink(WEBSOCKET_REL)!.href)
        .pipe(switchMap(() => this._fetchUserPreferences()))
        .subscribe();
    }
  }

  private _validateToken(tokenKey: TokenKeys): string | null {
    const token = localStorage.getItem(tokenKey);
    if (!isValidToken(token)) {
      localStorage.removeItem(tokenKey);
      return null;
    }
    return token;
  }
}
