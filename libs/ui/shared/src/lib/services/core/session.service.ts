import { Injectable } from '@angular/core';
import { AuthRelations, TOKEN_KEY, User } from '@app/domain';
import { HalFormService, Link, Resource } from '@hal-form-client';
import jwt_decode from 'jwt-decode';
import { catchError, EMPTY, Observable, of, Subscription, tap, timer } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { isTokenExpired, Token } from '../../utils/auth/auth.utils';
import { MessageService } from '../message.service';
import { httpToSession, Session } from './session.service.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private tokenWatchdog?: Subscription;
  private serviceWatchdog?: Subscription;

  constructor(
    private readonly messageService: MessageService,
    private readonly halFormService: HalFormService,
    private readonly userService: UserService,
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
        switchMap(() => (options?.user ? of(options.user) : this.userService.fetchCurrentUser())),
        tap((fetchedUser) => this.userService.initializeUser(fetchedUser)),
        tap(() => this._tokenWatchdog(token!)),
        catchError(() => this.clearSession()),
      );
    } else return this._initializeRoot();
  }

  public clearSession(): Observable<Resource> {
    return this.messageService.disconnect().pipe(
      tap(() => {
        this.userService.clearUser();
        this.tokenWatchdog?.unsubscribe();
        localStorage.removeItem(TOKEN_KEY);
      }),
      switchMap(() => this._initializeRoot()),
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
}
