import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad, CanActivateChild {
  constructor(private readonly router: Router, private readonly authService: AuthService) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this._canLoadAuthObservable();
  }

  canActivateChild(): Observable<boolean | UrlTree> {
    return this._canLoadAuthObservable();
  }

  canLoad(): Observable<boolean | UrlTree> {
    return this._canLoadAuthObservable();
  }

  private _canLoadAuthObservable() {
    return this.authService.isLoggedIn().pipe(map((isLoggedIn) => !isLoggedIn || this.router.createUrlTree([''])));
  }
}
