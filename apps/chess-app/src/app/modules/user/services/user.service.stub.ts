import { Injectable } from '@angular/core';
import { User } from '@chess-lite/domain';
import { of } from 'rxjs';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class StubUserService implements Partial<UserService> {
  isAllowedToUpdateProfile = () => true;
  isAllowedToDeleteAccount = () => true;
  isAllowedToUploadAvatar = () => true;
  getCurrentUsername = () => of('currentUsername');
  getCurrentUser = () => of(new User({}));
}

export const stubUserServiceProvider = {
  provide: UserService,
  useClass: StubUserService,
};
