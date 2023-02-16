import { Injectable } from '@angular/core';
import { CanMatch, Router, UrlTree } from '@angular/router';
import { isValidToken } from '@app/ui/shared/app';
import { TokenKeys } from '@app/ui/shared/domain';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanMatch {
  constructor(private readonly router: Router) {}

  canMatch(): boolean | UrlTree {
    return this._guard();
  }

  private _guard(): boolean | UrlTree {
    return !isValidToken(localStorage.getItem(TokenKeys.TOKEN) || '') || this.router.createUrlTree(['']);
  }
}
