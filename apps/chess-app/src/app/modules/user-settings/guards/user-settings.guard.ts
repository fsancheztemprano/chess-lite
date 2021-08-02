import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { CurrentUserService } from '../services/current-user.service';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsGuard implements CanLoad {
  constructor(private readonly userService: CurrentUserService) {}

  canLoad(): Observable<boolean> {
    return this.userService.hasCurrentUserLink();
  }
}
