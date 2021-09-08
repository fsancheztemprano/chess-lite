import { Injectable } from '@angular/core';
import { UserPreferences } from '@app/domain';
import { Resource } from '@hal-form-client';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PreferencesService {
  private _darkMode: Subject<boolean> = new Subject<boolean>();
  private _contentLanguage: Subject<string> = new Subject<string>();
  private defaultPreferences: UserPreferences = new Resource({ contentLanguage: 'en', darkMode: false });

  setPreferences(userPreferences: UserPreferences): void {
    if (typeof userPreferences.darkMode === 'boolean') {
      this._darkMode.next(userPreferences.darkMode);
    }
    if (userPreferences.contentLanguage?.length === 2) {
      this._contentLanguage.next(userPreferences.contentLanguage);
    }
  }

  clearPreferences() {
    this.setPreferences(this.defaultPreferences);
  }

  get darkMode(): Observable<boolean> {
    return this._darkMode.asObservable();
  }

  get contentLanguage(): Observable<string> {
    return this._contentLanguage.asObservable();
  }
}
