import { Injectable } from '@angular/core';
import { RolePage } from '@app/domain';
import { BehaviorSubject, noop, of } from 'rxjs';
import { RoleManagementTableDatasource } from './role-management-table.datasource';

@Injectable({ providedIn: 'root' })
export class StubRoleManagementTableDatasource implements Partial<RoleManagementTableDatasource> {
  rolePage$ = of({ isAllowedTo: () => true }) as BehaviorSubject<RolePage>;
  disconnect = noop;
  connect = () => of([]);
}

export const stubRoleManagementTableDatasourceProvider = {
  provide: RoleManagementTableDatasource,
  useClass: StubRoleManagementTableDatasource,
};
