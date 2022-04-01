import { TestBed } from '@angular/core/testing';
import { stubMessageServiceProvider, stubToasterServiceProvider } from '@app/ui/shared/app';
import { stubSearchServiceProvider } from '@app/ui/shared/core';
import { stubRoleManagementServiceProvider } from '../../../../services/role-management.service.stub';

import { RoleManagementTableDatasource } from './role-management-table.datasource';

describe('RoleManagementTableService', () => {
  let service: RoleManagementTableDatasource;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        stubRoleManagementServiceProvider,
        stubMessageServiceProvider,
        stubToasterServiceProvider,
        stubSearchServiceProvider,
      ],
    });
    service = TestBed.inject(RoleManagementTableDatasource);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
