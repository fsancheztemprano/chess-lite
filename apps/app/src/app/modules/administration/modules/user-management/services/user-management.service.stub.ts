import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { UserManagementService } from './user-management.service';

@Injectable({ providedIn: 'root' })
export class StubUserManagementService implements Partial<UserManagementService> {
  hasEmbeddedObject = () => of(true);
  getTemplate = () => of(null);
  hasLink = () => of(true);
  isAllowedTo = () => of(true);
}

export const stubUserManagementServiceProvider = {
  provide: UserManagementService,
  useClass: StubUserManagementService,
};
