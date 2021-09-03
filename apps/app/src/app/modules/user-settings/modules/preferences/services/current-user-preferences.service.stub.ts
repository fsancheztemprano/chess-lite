import { Injectable } from '@angular/core';
import { CurrentUserPreferencesService } from './current-user-preferences.service';

@Injectable({ providedIn: 'root' })
export class StubCurrentUserPreferencesService implements Partial<CurrentUserPreferencesService> {}

export const stubCurrentUserPreferencesServiceProvider = {
  provide: CurrentUserPreferencesService,
  useClass: StubCurrentUserPreferencesService,
};
