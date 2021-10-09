import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { stubAdministrationServiceProvider } from '../../../services/administration.service.stub';
import { RoleManagementService } from './role-management.service';

describe('RoleManagementService', () => {
  let service: RoleManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [stubAdministrationServiceProvider],
    });
    service = TestBed.inject(RoleManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
