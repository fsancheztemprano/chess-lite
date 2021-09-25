import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { UserSettingsService } from '../services/user-settings.service';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsGuard implements CanLoad {
  constructor(private readonly userService: UserSettingsService) {}

  canLoad(): Observable<boolean> {
    return this.userService.hasCurrentUserLink();
  }
}
