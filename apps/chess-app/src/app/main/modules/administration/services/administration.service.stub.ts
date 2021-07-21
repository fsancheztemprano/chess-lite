import { Injectable } from '@angular/core';
import { AdministrationService } from './administration.service';

@Injectable({ providedIn: 'root' })
export class StubAdministrationService implements Partial<AdministrationService> {}

export const stubAdministrationServiceProvider = {
  provide: AdministrationService,
  useClass: StubAdministrationService,
};
