import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, Router, UrlTree } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserManagementDetailComponent } from '../components/user-management-detail/user-management-detail.component';
import { UserManagementDetailService } from '../services/user-management-detail.service';

@Injectable({
  providedIn: 'root',
})
export class UserManagementDetailGuard implements CanActivate, CanDeactivate<UserManagementDetailComponent> {
  constructor(private readonly userManagementDetailService: UserManagementDetailService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    return this.userManagementDetailService.initialize(route.params.userId).pipe(
      map((user) => !!user),
      catchError(() => of(this.router.createUrlTree(['administration/user-management/list']))),
    );
  }

  canDeactivate(): boolean {
    this.userManagementDetailService.tearDown();
    return true;
  }
}
