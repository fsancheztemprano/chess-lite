import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { AdministrationService } from './administration.service';

@Injectable({ providedIn: 'root' })
export class StubAdministrationService implements Partial<AdministrationService> {
  hasEmbeddedObject = () => of(true);
}

export const stubAdministrationServiceProvider = {
  provide: AdministrationService,
  useClass: StubAdministrationService,
};
