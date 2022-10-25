import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { RolePage } from '@app/ui/shared/domain';
import { Observable } from 'rxjs';
import { RoleManagementService } from '../services/role-management.service';

@Injectable({
  providedIn: 'root',
})
export class RolesResolver implements Resolve<RolePage> {
  constructor(private readonly roleManagementService: RoleManagementService) {}

  resolve(): Observable<RolePage> {
    return this.roleManagementService.fetchRoles({ size: 1000 });
  }
}
