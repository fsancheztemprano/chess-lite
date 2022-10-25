import { TestBed } from '@angular/core/testing';
import { stubAdministrationServiceProvider } from '@app/ui/shared/feature/administration';
import { RoleManagementGuard } from './role-management.guard';

describe('RoleManagementGuard', () => {
  let guard: RoleManagementGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubAdministrationServiceProvider],
    });
    guard = TestBed.inject(RoleManagementGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
