import { TestBed } from '@angular/core/testing';
import { AuthorityManagementService } from './authority-management.service';
import { stubRoleManagementServiceProvider } from './role-management.service.stub';

describe('AuthorityManagementService', () => {
  let service: AuthorityManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubRoleManagementServiceProvider],
    });
    service = TestBed.inject(AuthorityManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
