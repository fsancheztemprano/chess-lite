import { Injectable } from '@angular/core';
import { User } from '@chess-lite/domain';
import { Observable, throwError } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { UserRootService } from './user-root.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly userRootService: UserRootService) {}

  public hasUserLink(): Observable<boolean> {
    return this.userRootService.hasLink('user');
  }

  public getCurrentUser(): Observable<User> {
    return this.userRootService.getLink('current-user').pipe(
      first(),
      switchMap((userLink) => {
        return userLink ? userLink.get<User>() : throwError(() => new Error('Cant find link to user.'));
      })
    );
  }

  public getUser(username: string): Observable<User> {
    return this.userRootService.getLink('user').pipe(
      first(),
      switchMap((userLink) => {
        return userLink ? userLink.get<User>({ username }) : throwError(() => new Error('Cant find link to user.'));
      })
    );
  }
}
