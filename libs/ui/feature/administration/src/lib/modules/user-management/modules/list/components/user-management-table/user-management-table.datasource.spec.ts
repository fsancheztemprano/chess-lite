import { TestBed } from '@angular/core/testing';
import { stubMessageServiceProvider } from '@app/ui/shared/app';
import { stubUserManagementServiceProvider } from '../../../../services/user-management.service.stub';
import { UserManagementTableDatasource } from './user-management-table.datasource';

describe('UserManagementTableDatasource', () => {
  let service: UserManagementTableDatasource;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubUserManagementServiceProvider, stubMessageServiceProvider],
    });
    service = TestBed.inject(UserManagementTableDatasource);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
