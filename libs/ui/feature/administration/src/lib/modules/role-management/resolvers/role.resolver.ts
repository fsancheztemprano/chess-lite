import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { RoleManagementService } from '../services/role-management.service';

export const roleResolver = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  return inject(RoleManagementService)
    .fetchOneRole(route.params.roleId)
    .pipe(
      catchError(() => {
        router.navigate(['administration', 'role-management']);
        return throwError(() => Error('Role not found'));
      }),
    );
};
