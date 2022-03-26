import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router, UrlTree } from '@angular/router';
import { TOKEN_KEY } from '@app/domain';
import { isTokenExpired } from '@app/ui/shared';

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
    return isTokenExpired(localStorage.getItem(TOKEN_KEY) || '') ? true : this.router.createUrlTree(['']);
  }
}
