import { TestBed } from '@angular/core/testing';
import { stubAdministrationServiceProvider } from '../../../services/administration.service.stub';
import { UserManagementGuard } from './user-management.guard';

describe('UserManagementGuard', () => {
  let guard: UserManagementGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubAdministrationServiceProvider],
    });
    guard = TestBed.inject(UserManagementGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
