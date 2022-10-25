import { Injectable } from '@angular/core';
import { User, UserPreferences } from '@app/ui/shared/domain';
import { of } from 'rxjs';
import { UserSettingsService } from './user-settings.service';

@Injectable({ providedIn: 'root' })
export class StubUserSettingsService implements Partial<UserSettingsService> {
  hasTemplateToUpdateProfile = () => of(true);
  hasTemplateToChangePassword = () => of(true);
  hasTemplateToDeleteAccount = () => of(true);
  hasTemplateToUploadAvatar = () => of(true);
  hasTemplateToUpdateUserPreferences = () => of(true);
  hasTemplate = () => of(true);
  hasLinkToUserPreferences = () => of(true);
  getCurrentUsername = () => of('currentUsername');
  getCurrentUser = () => of(new User({}));
  getCurrentUserPreferences = () => of(new UserPreferences({}));
}

export const stubUserSettingsServiceProvider = {
  provide: UserSettingsService,
  useClass: StubUserSettingsService,
};
