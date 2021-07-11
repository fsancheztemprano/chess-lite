import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { User } from '@chess-lite/domain';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class CurrentUserResolver implements Resolve<User> {
  constructor(private readonly userService: UserService) {}

  resolve(): Observable<User> {
    return this.userService.getCurrentUser();
  }
}
