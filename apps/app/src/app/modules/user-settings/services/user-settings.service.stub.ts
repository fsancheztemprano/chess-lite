import { Injectable } from '@angular/core';
import { User } from '@app/domain';
import { of } from 'rxjs';
import { UserSettingsService } from './user-settings.service';

@Injectable({ providedIn: 'root' })
export class StubUserSettingsService implements Partial<UserSettingsService> {
  isAllowedToUpdateProfile = () => of(true);
  isAllowedToChangePassword = () => of(true);
  isAllowedToDeleteAccount = () => of(true);
  isAllowedToUploadAvatar = () => of(true);
  isAllowedTo = () => of(true);
  hasLinkToUserPreferences = () => of(true);
  getCurrentUsername = () => of('currentUsername');
  getCurrentUser = () => of(new User({}));
}

export const stubUserSettingsServiceProvider = {
  provide: UserSettingsService,
  useClass: StubUserSettingsService,
};
