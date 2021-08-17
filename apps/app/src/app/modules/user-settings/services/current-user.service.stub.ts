import { Injectable } from '@angular/core';
import { User } from '@app/domain';
import { of } from 'rxjs';
import { CurrentUserService } from './current-user.service';

@Injectable({ providedIn: 'root' })
export class StubCurrentUserService implements Partial<CurrentUserService> {
  isAllowedToUpdateProfile = () => of(true);
  isAllowedToDeleteAccount = () => of(true);
  isAllowedToUploadAvatar = () => of(true);
  getCurrentUsername = () => of('currentUsername');
  getCurrentUser = () => of(new User({}));
}

export const stubCurrentUserServiceProvider = {
  provide: CurrentUserService,
  useClass: StubCurrentUserService,
};
