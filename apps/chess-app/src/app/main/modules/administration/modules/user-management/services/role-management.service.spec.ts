import { TestBed } from '@angular/core/testing';

import { RoleManagementService } from './role-management.service';
import { stubUserManagementServiceProvider } from './user-management.service.stub';

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
