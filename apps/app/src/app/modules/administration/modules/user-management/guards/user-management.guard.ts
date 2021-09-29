import { Injectable } from '@angular/core';
import { CanActivate, CanLoad } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserManagementService } from '../services/user-management.service';

@Injectable({
  providedIn: 'root',
})
export class UserManagementGuard implements CanLoad, CanActivate {
  constructor(private readonly userManagementService: UserManagementService) {}

  canActivate(): Observable<boolean> {
    return this._guard();
  }

  canLoad(): Observable<boolean> {
    return this._guard();
  }

  private _guard(): Observable<boolean> {
    return this.userManagementService.initialize().pipe(
      map((resources) => !!resources),
      catchError(() => of(false)),
    );
  }
}
