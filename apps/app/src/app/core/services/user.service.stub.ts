import { Injectable } from '@angular/core';
import { User } from '@app/domain';
import { of } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class StubUserService implements Partial<UserService> {
  getUser = () => of({} as User);
}

export const stubUserServiceProvider = {
  provide: UserService,
  useClass: StubUserService,
};
