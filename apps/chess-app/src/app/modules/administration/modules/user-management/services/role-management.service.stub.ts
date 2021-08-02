import { Injectable } from '@angular/core';
import { RoleManagementService } from './role-management.service';

@Injectable({ providedIn: 'root' })
export class StubRoleManagementService implements Partial<RoleManagementService> {}

export const stubRoleManagementServiceProvider = {
  provide: RoleManagementService,
  useClass: StubRoleManagementService,
};
