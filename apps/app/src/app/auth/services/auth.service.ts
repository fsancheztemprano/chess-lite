import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CurrentUserRelations, HttpHeaders, TOKEN_KEY, User, UserPreferences } from '@app/domain';
import { HalFormService, IResource, Resource } from '@hal-form-client';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { first, map, switchMap, tap } from 'rxjs/operators';
import { MessageService } from '../../core/services/message.service';
import { PreferencesService } from '../../core/services/preferences.service';
import { isTokenExpired } from '../utils/auth.utils';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _user$ = new BehaviorSubject<User | null>(null);

  constructor(
    private readonly halFormService: HalFormService,
    private readonly preferencesService: PreferencesService,
    private readonly messageService: MessageService,
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
    return localStorage.getItem(TOKEN_KEY);
  }

  public setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  public removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  public clearLocalSession(): Observable<Resource> {
    this.messageService.disconnect();
    this.removeToken();
    this.setUser(null);
    this.preferencesService.clearPreferences();
    return this.halFormService.initialize();
  }

  public preInitialize(): void {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!!token && isTokenExpired(token)) {
      this.removeToken();
    }
  }

  public initialize(): Observable<unknown> {
    return this._isAuthenticated() ? this.fetchCurrentUser().pipe(tap((user) => this._initializeUser(user))) : EMPTY;
  }

  public setLocalSessionPipe(): (observable: Observable<HttpResponse<IResource>>) => Observable<User | null> {
    return (observable: Observable<HttpResponse<IResource>>) => {
      return observable.pipe(
        map((response) => {
          const token = response?.headers?.get(HttpHeaders.JWT_TOKEN);
          if (token) {
            this.setToken(token);
            this.halFormService.initialize().subscribe();
          }
          const user = new Resource(response.body as IResource);
          this._initializeUser(user);
          return user;
        }),
      );
    };
  }

  private _isAuthenticated(): boolean {
    const token = localStorage.getItem(TOKEN_KEY);
    return !!token && !isTokenExpired(token);
  }

  private _initializeUser(user: User) {
    this.messageService.connect();
    this.setUser(user);
    this.fetchCurrentUserPreferences(user).subscribe((userPreferences) =>
      this.preferencesService.setPreferences(userPreferences),
    );
  }
}
