import { Injectable } from '@angular/core';
import { AuthorityManagementService } from './authority-management.service';

@Injectable({ providedIn: 'root' })
export class StubAuthorityManagementService implements Partial<AuthorityManagementService> {}

export const stubAuthorityManagementServiceProvider = {
  provide: AuthorityManagementService,
  useClass: StubAuthorityManagementService,
};
