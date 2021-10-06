import { TestBed } from '@angular/core/testing';
import { stubRoleManagementServiceProvider } from '../services/role-management.service.stub';
import { RoleManagementGuard } from './role-management.guard';

describe('RoleManagementGuard', () => {
  let guard: RoleManagementGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubRoleManagementServiceProvider],
    });
    guard = TestBed.inject(RoleManagementGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
