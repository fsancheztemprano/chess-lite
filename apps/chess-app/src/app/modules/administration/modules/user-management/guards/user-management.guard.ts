import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserManagementService } from '../services/user-management.service';

@Injectable({
  providedIn: 'root',
})
export class UserManagementGuard implements CanLoad {
  constructor(private readonly userManagementService: UserManagementService) {}

  canLoad(): Observable<boolean> {
    return this.userManagementService.initialize().pipe(
      map((resources) => !!resources),
      catchError(() => of(false)),
    );
  }
}
