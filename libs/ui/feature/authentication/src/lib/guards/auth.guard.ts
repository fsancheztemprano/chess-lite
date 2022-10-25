import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router, UrlTree } from '@angular/router';
import { isValidToken } from '@app/ui/shared/app';
import { TokenKeys } from '@app/ui/shared/domain';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private readonly router: Router) {}

  canActivate(): boolean | UrlTree {
    return this._guard();
  }

  canLoad(): boolean | UrlTree {
    return this._guard();
  }

  private _guard(): boolean | UrlTree {
    return !isValidToken(localStorage.getItem(TokenKeys.TOKEN) || '') || this.router.createUrlTree(['']);
  }
}
