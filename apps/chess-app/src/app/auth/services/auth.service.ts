import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders, User } from '@chess-lite/domain';
import { IResource, Resource } from '@chess-lite/hal-form-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isTokenExpired } from '../utils/auth.utils';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';

  private readonly _user = new BehaviorSubject<User | null>(null);

  get user(): Observable<User | null> {
    return this._user.asObservable();
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
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return !isTokenExpired(token);
  }

  public setLocalSessionPipe(): (observable: Observable<HttpResponse<IResource>>) => Observable<User | null> {
    return (observable: Observable<HttpResponse<IResource>>) => {
      return observable.pipe(
        map((response) => {
          const token = response?.headers?.get(HttpHeaders.JWT_TOKEN);
          if (token && response.body) {
            this.setToken(token);
            const user = new Resource(response.body);
            this.setUser(user.as());
            return user.as<User>();
          }
          return null;
        })
      );
    };
  }
}
