import { TestBed } from '@angular/core/testing';
import { stubUserManagementServiceProvider } from '../../../../services/user-management.service.stub';
import { UserManagementTableDatasource } from './user-management-table.datasource';

describe('UserManagementTableDatasource', () => {
  let service: UserManagementTableDatasource;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubUserManagementServiceProvider],
    });
    service = TestBed.inject(UserManagementTableDatasource);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
