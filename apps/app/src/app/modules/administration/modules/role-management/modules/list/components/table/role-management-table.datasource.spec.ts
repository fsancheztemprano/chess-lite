import { TestBed } from '@angular/core/testing';
import { stubSearchServiceProvider } from '../../../../../../../../core/modules/toolbar/services/search.service.stub';
import { stubMessageServiceProvider } from '../../../../../../../../core/services/message.service.stub';
import { stubToasterServiceProvider } from '../../../../../../../../core/services/toaster.service.stub';
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
