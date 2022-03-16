import { Injectable } from '@angular/core';
import { noop, Observable, of } from 'rxjs';
import { PreferencesService } from './preferences.service';

@Injectable({
  providedIn: 'root',
})
export class StubPreferencesService implements Partial<PreferencesService> {
  setPreferences = noop;

  get contentLanguage(): Observable<string> {
    return of('en');
  }

  get darkMode(): Observable<boolean> {
    return of(false);
  }
}

export const stubPreferencesServiceProvider = {
  provide: PreferencesService,
  useClass: StubPreferencesService,
};
