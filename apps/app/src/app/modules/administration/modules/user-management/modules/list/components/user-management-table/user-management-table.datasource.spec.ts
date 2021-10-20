import { TestBed } from '@angular/core/testing';
import { stubSearchServiceProvider } from '../../../../../../../../core/modules/toolbar/services/search.service.stub';
import { stubMessageServiceProvider } from '../../../../../../../../core/services/message.service.stub';
import { stubToasterServiceProvider } from '../../../../../../../../core/services/toaster.service.stub';
import { stubUserManagementServiceProvider } from '../../../../services/user-management.service.stub';
import { UserManagementTableDatasource } from './user-management-table.datasource';

describe('UserManagementTableDatasource', () => {
  let service: UserManagementTableDatasource;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        stubUserManagementServiceProvider,
        stubMessageServiceProvider,
        stubToasterServiceProvider,
        stubSearchServiceProvider,
      ],
    });
    service = TestBed.inject(UserManagementTableDatasource);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
