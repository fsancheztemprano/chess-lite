import { Injectable } from '@angular/core';
import { CanActivate, CanLoad } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { RoleManagementService } from '../services/role-management.service';

@Injectable({
  providedIn: 'root',
})
export class RoleManagementGuard implements CanLoad, CanActivate {
  constructor(private readonly roleManagementService: RoleManagementService) {}

  canActivate(): Observable<boolean> {
    return this._guard();
  }

  canLoad(): Observable<boolean> {
    return this._guard();
  }

  private _guard(): Observable<boolean> {
    return this.roleManagementService.initialize().pipe(
      map((resources) => !!resources),
      catchError(() => of(false)),
    );
  }
}
