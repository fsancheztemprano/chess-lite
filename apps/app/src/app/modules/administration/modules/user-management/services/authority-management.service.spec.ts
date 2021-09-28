import { TestBed } from '@angular/core/testing';
import { AuthorityManagementService } from './authority-management.service';
import { stubUserManagementServiceProvider } from './user-management.service.stub';

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
