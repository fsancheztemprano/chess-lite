import { Injectable } from '@angular/core';
import { CurrentUserRelations, UserPreferences } from '@app/domain';
import { noLinkError } from '@hal-form-client';
import { Observable, switchMap } from 'rxjs';
import { CurrentUserService } from '../../../services/current-user.service';

@Injectable({
  providedIn: 'root',
})
export class CurrentUserPreferencesService {
  constructor(private readonly currentUserService: CurrentUserService) {}

  getCurrentUserPreferences(): Observable<UserPreferences> {
    return this.currentUserService
      .getLinkToUserPreferences()
      .pipe(switchMap((link) => (link ? link.get() : noLinkError(CurrentUserRelations.USER_PREFERENCES_REL))));
  }

  updateCurrentUserPreferences(
    userPreferences: UserPreferences,
    changes: UserPreferences,
  ): Observable<UserPreferences> {
    return userPreferences.submitToTemplateOrThrow(CurrentUserRelations.UPDATE_PREFERENCES_REL, changes);
  }
}
