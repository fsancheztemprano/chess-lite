import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Role } from '@app/ui/shared/domain';
import { catchError, Observable, throwError } from 'rxjs';
import { RoleManagementService } from '../services/role-management.service';

@Injectable({
  providedIn: 'root',
})
export class RoleResolver implements Resolve<Role> {
  constructor(private readonly roleManagementService: RoleManagementService, private readonly router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Role> {
    return this.roleManagementService.fetchOneRole(route.params.roleId).pipe(
      catchError(() => {
        this.router.navigate(['administration', 'role-management']);
        return throwError(() => Error('Role not found'));
      }),
    );
  }
}
