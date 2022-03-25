import { Injectable } from '@angular/core';
import { AuthRelations, TOKEN_KEY, User } from '@app/domain';
import { HalFormService, Link, Resource } from '@hal-form-client';
import jwt_decode from 'jwt-decode';
import { catchError, delay, Observable, of, Subscription, tap, timer } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { isTokenExpired, Token } from '../../utils/auth/auth.utils';
import { MessageService } from '../message.service';
import { mapSession, Session } from './session.service.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private watchdog = new Subscription();

  constructor(
    private readonly messageService: MessageService,
    private readonly halFormService: HalFormService,
    private readonly userService: UserService,
  ) {
    this._validateToken(localStorage.getItem(TOKEN_KEY));
  }

  public initialize(options?: Session): Observable<Resource> {
    const token: string | null = options?.token || localStorage.getItem(TOKEN_KEY);
    if (this._validateToken(token)) {
      localStorage.setItem(TOKEN_KEY, token!);
      this.messageService.connect();
      return this.halFormService.initialize().pipe(
        tap(() => this.tokenWatchdog(token!)),
        switchMap(() => (options?.user ? of(options.user) : this.userService.fetchCurrentUser())),
        tap((fetchedUser) => this.userService.initializeUser(fetchedUser)),
        catchError(() => this.clearSession()),
      );
    } else return this.halFormService.initialize();
  }

  public clearSession(): Observable<Resource> {
    this.userService.clearUser();
    this.messageService.disconnect();
    this.watchdog?.unsubscribe();
    localStorage.removeItem(TOKEN_KEY);
    return this.halFormService.initialize();
  }

  private _validateToken(token: string | null): boolean {
    if (!token || (token && isTokenExpired(token))) {
      localStorage.removeItem(TOKEN_KEY);
      return false;
    }
    return true;
  }

  tokenWatchdog(token: string) {
    const decoded: Token = jwt_decode<Token>(token);
    const updateThreshold = new Date((decoded.exp - (decoded.exp - decoded.iat) * 0.1) * 1000);
    const nextUpdate =
      updateThreshold.valueOf() > new Date().valueOf() ? timer(updateThreshold) : of(0).pipe(delay(3000));
    this.watchdog?.unsubscribe();
    this.watchdog = nextUpdate
      .pipe(
        switchMap(() => this.halFormService.getLinkOrThrow(AuthRelations.TOKEN_RELATION).pipe(first())),
        switchMap((link: Link) => link.fetch<User>()),
        map(mapSession),
        tap(console.log),
        switchMap((session) => this.initialize(session)),
      )
      .subscribe();
  }
}
