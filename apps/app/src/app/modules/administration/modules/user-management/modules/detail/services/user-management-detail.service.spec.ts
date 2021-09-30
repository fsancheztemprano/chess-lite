import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { stubMessageServiceProvider } from '../../../../../../../core/services/message.service.stub';
import { stubToasterServiceProvider } from '../../../../../../../core/services/toaster.service.stub';
import { stubUserManagementServiceProvider } from '../../../services/user-management.service.stub';
import { UserManagementDetailService } from './user-management-detail.service';

describe('UserManagementDetailService', () => {
  let service: UserManagementDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [stubUserManagementServiceProvider, stubMessageServiceProvider, stubToasterServiceProvider],
    });
    service = TestBed.inject(UserManagementDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
