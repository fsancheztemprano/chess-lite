import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { stubUserManagementDetailServiceProvider } from '../services/user-management-detail.service.stub';
import { UserManagementDetailGuard } from './user-management-detail.guard';

describe('UserManagementDetailGuard', () => {
  let guard: UserManagementDetailGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [stubUserManagementDetailServiceProvider],
    });
    guard = TestBed.inject(UserManagementDetailGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
