import { Injectable } from '@angular/core';
import { UserRootService } from './user-root.service';

@Injectable({ providedIn: 'root' })
export class StubUserRootService implements Partial<UserRootService> {}

export const stubUserRootServiceProvider = {
  provide: UserRootService,
  useClass: StubUserRootService,
};
