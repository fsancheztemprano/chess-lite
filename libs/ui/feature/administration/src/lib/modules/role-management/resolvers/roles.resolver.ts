import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Role } from '@app/domain';
import { Observable } from 'rxjs';
import { RoleManagementService } from '../services/role-management.service';

@Injectable({
  providedIn: 'root',
})
export class RolesResolver implements Resolve<Role[]> {
  constructor(private readonly roleManagementService: RoleManagementService) {}

  resolve(): Observable<Role[]> {
    return this.roleManagementService.fetchAllRoles();
  }
}
