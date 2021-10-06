import { TestBed } from '@angular/core/testing';
import { stubUserManagementServiceProvider } from '../../user-management/services/user-management.service.stub';
import { AuthorityManagementService } from './authority-management.service';

describe('AuthorityManagementService', () => {
  let service: AuthorityManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubUserManagementServiceProvider],
    });
    service = TestBed.inject(AuthorityManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
