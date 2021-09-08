import { Injectable } from '@angular/core';
import { User, UserManagementRelations, UserPreferences } from '@app/domain';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserPreferencesService {
  getUserPreferences(user: User): Observable<UserPreferences> {
    return user.getLinkOrThrow(UserManagementRelations.USER_PREFERENCES_REL).get().pipe(first());
  }

  updateUserPreferences(userPreferences: UserPreferences, changes: UserPreferences): Observable<UserPreferences> {
    return userPreferences.submitToTemplateOrThrow(UserManagementRelations.USER_UPDATE_REL, changes);
  }
}
