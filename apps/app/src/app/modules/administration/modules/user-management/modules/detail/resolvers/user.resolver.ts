import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { User } from '@app/domain';
import { catchError, Observable, throwError } from 'rxjs';
import { UserManagementService } from '../../../services/user-management.service';

@Injectable({
  providedIn: 'root',
})
export class UserResolver implements Resolve<User> {
  constructor(private readonly userManagementService: UserManagementService, private readonly router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    return this.userManagementService.fetchUser(route.params.userId).pipe(
      catchError(() => {
        this.router.navigate(['administration', 'user-management']);
        return throwError(() => Error('User not found'));
      }),
    );
  }
}
