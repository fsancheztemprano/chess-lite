import { TestBed } from '@angular/core/testing';
import { stubUserManagementServiceProvider } from '../../../services/user-management.service.stub';

import { UserManagementDetailService } from './user-management-detail.service';

describe('UserManagementDetailService', () => {
  let service: UserManagementDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubUserManagementServiceProvider],
    });
    service = TestBed.inject(UserManagementDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
