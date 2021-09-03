import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { UserPreferences } from '@app/domain';
import { Observable } from 'rxjs';
import { CurrentUserPreferencesService } from '../services/current-user-preferences.service';

@Injectable({
  providedIn: 'root',
})
export class CurrentUserPreferencesResolver implements Resolve<UserPreferences> {
  constructor(private readonly userPreferencesService: CurrentUserPreferencesService) {}

  resolve(): Observable<UserPreferences> {
    return this.userPreferencesService.getCurrentUserPreferences();
  }
}
