import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpHeaders, LoginInput, User } from '@chess-lite/domain';
import { HalFormService, Resource, Template } from '@chess-lite/hal-form-client';
import jwt_decode from 'jwt-decode';
import { BehaviorSubject, EMPTY, Observable, throwError } from 'rxjs';
import { first, map, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly LOGIN_RELATION = 'login';

  private readonly _user = new BehaviorSubject<User | null>(null);

  constructor(private readonly halFormService: HalFormService, private readonly router: Router) {}

  public getLoginTemplate(): Observable<Template | null> {
    return this.halFormService.getTemplate(this.LOGIN_RELATION);
  }

  get user(): Observable<User | null> {
    return this._user.asObservable();
  }

  public setUser(user: User | null): void {
    this._user.next(user);
  }

  isLoggedIn(): Observable<boolean> {
    return this.user.pipe(map((user) => !!user));
  }

  public canLogin(): Observable<boolean> {
    return this.halFormService.isAllowedTo(this.LOGIN_RELATION);
  }

  public login(loginInput: LoginInput): Observable<User | null> {
    return this.getLoginTemplate().pipe(
      first(),
      switchMap((loginTemplate) => {
        return loginTemplate
          ? loginTemplate.submit(loginInput, null, 'response').pipe(
              map((response) => {
                const token = response.headers?.get(HttpHeaders.JWT_TOKEN);
                if (token) {
                  this._setToken(token);
                  const user = new Resource(response.body);
                  this.setUser(user.as());
                  return user.as<User>();
                }
                return null;
              }),
              tap(() => this.halFormService.initialize().subscribe())
            )
          : throwError(() => new Error('Not allowed to login!'));
      })
    );
  }

  public logout(): void {
    this.removeToken();
    this.setUser(null);
    this.halFormService.initialize().subscribe(() => {
      this.router.navigate(['auth', 'login']);
    });
  }

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private _setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  public removeToken() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string | null): boolean {
    console.log('isTokenExpired', jwt_decode(token || ''));
    const decoded: { exp: number } = jwt_decode(token || '');
    return token ? Date.now() < Number(decoded.exp) : false;
  }

  getCurrentUser(): Observable<User> {
    return EMPTY;
  }
}
