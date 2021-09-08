import { Injectable } from '@angular/core';
import { UserPreferencesService } from './user-preferences.service';

@Injectable({
  providedIn: 'root',
})
export class StubUserPreferencesService implements Partial<UserPreferencesService> {}

export const stubUserPreferencesServiceProvider = {
  provide: UserPreferencesService,
  useClass: StubUserPreferencesService,
};
