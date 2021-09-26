import { Injectable } from '@angular/core';
import { User, UserPreferences } from '@app/domain';
import { of } from 'rxjs';
import { UserManagementDetailService } from './user-management-detail.service';

@Injectable({ providedIn: 'root' })
export class StubUserManagementDetailService implements Partial<UserManagementDetailService> {
  getUser = () => of(new User({}));
  getUserPreferences = () => of(new UserPreferences({}));
  canUpdateProfile = () => of(true);
  canSendActivationToken = () => of(true);
  canDeleteAccount = () => of(true);
}

export const stubUserManagementDetailServiceProvider = {
  provide: UserManagementDetailService,
  useClass: StubUserManagementDetailService,
};
