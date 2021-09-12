import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserRelations, HttpHeaders, User, UserPreferences } from '@app/domain';
import { HalFormService, IResource, Resource } from '@hal-form-client';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { first, map, switchMap, tap } from 'rxjs/operators';
import { PreferencesService } from '../../core/services/preferences.service';
import { isTokenExpired } from '../utils/auth.utils';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly _user$ = new BehaviorSubject<User | null>(null);

  constructor(
    private readonly halFormService: HalFormService,
    private readonly preferencesService: PreferencesService,
    private readonly router: Router,
  ) {}

  get user$(): Observable<User | null> {
    return this._user$.asObservable();
  }

  public getCurrentUsername(): Observable<string | null> {
    return this.user$.pipe(
      map((user) => {
        return user?.username || null;
      }),
    );
  }

  public setUser(user: User | null): void {
    this._user$.next(user);
  }

  public fetchCurrentUser(): Observable<User> {
    return this.halFormService.getLinkOrThrow(CurrentUserRelations.CURRENT_USER_REL).pipe(
      first(),
      switchMap((userLink) => userLink.get()),
    );
  }

  public fetchCurrentUserPreferences(user: User): Observable<UserPreferences> {
    return user.getLinkOrThrow(CurrentUserRelations.USER_PREFERENCES_REL).get();
  }

  public isLoggedIn(): Observable<boolean> {
    return this.user$.pipe(map((user) => !!user));
  }

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  public removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  public clearLocalSession(): void {
    this.removeToken();
    this.setUser(null);
    this.preferencesService.clearPreferences();
    this.halFormService.initialize().subscribe(() => {
      this.router.navigate(['auth', 'signup']);
    });
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return !!token && !isTokenExpired(token);
  }

  public preInitialize(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!!token && isTokenExpired(token)) {
      this.removeToken();
    }
  }

  public initialize(): Observable<unknown> {
    return this.isAuthenticated() ? this.fetchCurrentUser().pipe(tap((user) => this._initializeUser(user))) : EMPTY;
  }

  public setLocalSessionPipe(): (observable: Observable<HttpResponse<IResource>>) => Observable<User | null> {
    return (observable: Observable<HttpResponse<IResource>>) => {
      return observable.pipe(
        this._setTokenPipe(),
        tap((user) => this._initializeUser(user)),
      );
    };
  }

  private initializeUserPreferences(user: User) {
    return this.fetchCurrentUserPreferences(user).subscribe((userPreferences) =>
      this.preferencesService.setPreferences(userPreferences),
    );
  }

  private _setTokenPipe(): (observable: Observable<HttpResponse<unknown>>) => Observable<User> {
    return (observable: Observable<HttpResponse<unknown>>) => {
      return observable.pipe(
        map((response) => {
          const token = response?.headers?.get(HttpHeaders.JWT_TOKEN);
          if (token) {
            this.setToken(token);
          }
          return new Resource(response.body as IResource);
        }),
      );
    };
  }

  private _initializeUser(user: User) {
    this.halFormService.initialize().subscribe();
    this.setUser(user);
    this.initializeUserPreferences(user);
  }
}
