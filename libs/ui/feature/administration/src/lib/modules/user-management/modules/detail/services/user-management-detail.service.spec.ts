import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { stubMessageServiceProvider, stubToasterServiceProvider } from '@app/ui/shared/app';
import { getTranslocoModule } from '@app/ui/testing';
import { stubUserManagementServiceProvider } from '../../../services/user-management.service.stub';
import { UserManagementDetailService } from './user-management-detail.service';

describe('UserManagementDetailService', () => {
  let service: UserManagementDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, getTranslocoModule()],
      providers: [stubUserManagementServiceProvider, stubMessageServiceProvider, stubToasterServiceProvider],
    });
    service = TestBed.inject(UserManagementDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
