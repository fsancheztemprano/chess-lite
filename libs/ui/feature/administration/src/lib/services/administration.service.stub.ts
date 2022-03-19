import { Injectable } from '@angular/core';
import { Resource } from '@hal-form-client';
import { of } from 'rxjs';
import { AdministrationService } from './administration.service';

@Injectable({ providedIn: 'root' })
export class StubAdministrationService implements Partial<AdministrationService> {
  hasEmbeddedObject = () => of(true);
  getEmbeddedObject = <T>() => of(new Resource({}) as unknown as T);
  hasUserManagementEmbedded = () => of(true);
  hasGlobalSettingsLink = () => of(true);
  hasRoleManagementEmbedded = () => of(true);
  hasServiceLogsLink = () => of(true);
}

export const stubAdministrationServiceProvider = {
  provide: AdministrationService,
  useClass: StubAdministrationService,
};
