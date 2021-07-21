import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanLoad {
  constructor(private readonly userService: UserService) {}

  canLoad(): Observable<boolean> {
    return this.userService.hasUserLink();
  }
}
