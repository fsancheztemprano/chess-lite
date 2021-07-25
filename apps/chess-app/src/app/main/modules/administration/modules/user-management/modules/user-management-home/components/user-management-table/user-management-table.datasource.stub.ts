import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { UserManagementTableDatasource } from './user-management-table.datasource';

@Injectable({ providedIn: 'root' })
export class StubUserManagementTableDatasource implements Partial<UserManagementTableDatasource> {
  connect = () => of([]);
}

export const stubUserManagementTableDatasourceProvider = {
  provide: UserManagementTableDatasource,
  useClass: StubUserManagementTableDatasource,
};
