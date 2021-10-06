import { TestBed } from '@angular/core/testing';
import { stubUserManagementServiceProvider } from '../../user-management/services/user-management.service.stub';
import { RoleManagementService } from './role-management.service';

describe('RoleManagementService', () => {
  let service: RoleManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubUserManagementServiceProvider],
    });
    service = TestBed.inject(RoleManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
