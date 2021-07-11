import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { User } from '@chess-lite/domain';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class UserResolver implements Resolve<User> {
  constructor(private readonly userService: UserService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    return this.userService.getUser(route?.params?.username);
  }
}
