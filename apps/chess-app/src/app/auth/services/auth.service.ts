import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserRelations, HttpHeaders, User } from '@chess-lite/domain';
import { HalFormService, IResource, noLinkError, Resource } from '@chess-lite/hal-form-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, map, switchMap, tap } from 'rxjs/operators';
import { isTokenExpired } from '../utils/auth.utils';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly _user$ = new BehaviorSubject<User | null>(null);

  constructor(private readonly halFormService: HalFormService, private readonly router: Router) {}

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
    return this.halFormService.getLink(CurrentUserRelations.CURRENT_USER_REL).pipe(
      first(),
      switchMap((userLink) => {
        return userLink ? userLink.get() : noLinkError(CurrentUserRelations.CURRENT_USER_REL);
      }),
      tap((user) => user && this.setUser(user)),
    );
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
    this.halFormService.initialize().subscribe(() => {
      this.router.navigate(['auth', 'signup']);
    });
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return !!token && !isTokenExpired(token);
  }

  public setUserPipe(): (observable: Observable<User>) => Observable<User> {
    return (observable: Observable<User>) => {
      return observable.pipe(tap((user) => this.setUser(user)));
    };
  }

  public setLocalSessionPipe(): (observable: Observable<HttpResponse<IResource>>) => Observable<User | null> {
    return (observable: Observable<HttpResponse<IResource>>) => {
      return observable.pipe(this._setTokenPipe(), this._setUserOrNullPipe());
    };
  }

  private _setTokenPipe(): (observable: Observable<HttpResponse<IResource>>) => Observable<User | null> {
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

  private _setUserOrNullPipe(): (observable: Observable<User | null>) => Observable<User | null> {
    return (observable: Observable<User | null>) => {
      return observable.pipe(tap((user) => this.setUser(user)));
    };
  }
}
