import { Injectable } from '@angular/core';
import { CanActivate, CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { UserSettingsService } from '../services/user-settings.service';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsGuard implements CanLoad, CanActivate {
  constructor(private readonly userService: UserSettingsService) {}

  canActivate(): Observable<boolean> {
    return this._guard();
  }

  canLoad(): Observable<boolean> {
    return this._guard();
  }

  private _guard(): Observable<boolean> {
    return this.userService.hasCurrentUserLink();
  }
}
