import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpHeaders, User } from '@chess-lite/domain';
import { HalFormService, IResource, noLinkError, Resource } from '@chess-lite/hal-form-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, map, switchMap, tap } from 'rxjs/operators';
import { isTokenExpired } from '../utils/auth.utils';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly _user = new BehaviorSubject<User | null>(null);

  public readonly CURRENT_USER_REL = 'current-user';

  constructor(private readonly halFormService: HalFormService, private readonly router: Router) {}

  get user(): Observable<User | null> {
    return this._user.asObservable();
  }

  getCurrentUsername(): Observable<string | null> {
    return this.user.pipe(
      map((user) => {
        return user?.username || null;
      }),
    );
  }

  public fetchCurrentUser(): Observable<User> {
    return this.halFormService.getLink(this.CURRENT_USER_REL).pipe(
      first(),
      switchMap((userLink) => {
        return userLink ? userLink.get<User>() : noLinkError(this.CURRENT_USER_REL);
      }),
      tap((user) => user && this.setUser(user)),
    );
  }

  public setUser(user: User | null): void {
    this._user.next(user);
  }

  public isLoggedIn(): Observable<boolean> {
    return this.user.pipe(map((user) => !!user));
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
    this.halFormService.initialize().subscribe(() => {
      this.router.navigate(['auth', 'login']);
    });
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return !!token && !isTokenExpired(token);
  }

  public setTokenPipe(): (observable: Observable<HttpResponse<IResource>>) => Observable<Resource | null> {
    return (observable: Observable<HttpResponse<IResource>>) => {
      return observable.pipe(
        map((response) => {
          const token = response?.headers?.get(HttpHeaders.JWT_TOKEN);
          if (token) {
            this.setToken(token);
          }
          return response.body ? new Resource(response.body) : null;
        }),
      );
    };
  }

  public setUserPipe(): (observable: Observable<Resource | null>) => Observable<User | null> {
    return (observable: Observable<Resource | null>) => {
      return observable.pipe(
        map((user) => (user ? user.as<User>() : null)),
        tap((user) => this.setUser(user)),
      );
    };
  }

  public setLocalSessionPipe(): (observable: Observable<HttpResponse<IResource>>) => Observable<User | null> {
    return (observable: Observable<HttpResponse<IResource>>) => {
      return observable.pipe(this.setTokenPipe(), this.setUserPipe());
    };
  }
}
