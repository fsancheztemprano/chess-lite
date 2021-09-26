import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserManagementDetailComponent } from '../components/user-management-detail/user-management-detail.component';
import { UserManagementDetailService } from '../services/user-management-detail.service';

@Injectable({
  providedIn: 'root',
})
export class UserManagementDetailGuard implements CanActivate, CanDeactivate<UserManagementDetailComponent> {
  constructor(private readonly userManagementDetailService: UserManagementDetailService) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.userManagementDetailService.initialize(route.params.userId).pipe(map((user) => !!user));
  }

  canDeactivate(): boolean {
    this.userManagementDetailService.deactivate();
    return true;
  }
}
