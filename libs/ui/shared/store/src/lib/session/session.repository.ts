import { Injectable } from '@angular/core';
import { User, UserPreferences } from '@app/ui/shared/domain';
import { select } from '@ngneat/elf';
import { Observable } from 'rxjs';
import { localizationStore } from '../localization/localization.store';
import { themeStore } from '../theme/theme.store';
import { sessionStore } from './session.store';

@Injectable({ providedIn: 'root' })
export class SessionRepository {
  user$: Observable<User | null> = sessionStore.pipe(select((core) => core.user));
  userPreferences$: Observable<UserPreferences | null> = sessionStore.pipe(select((core) => core.userPreferences));

  updateUser(user: User | null) {
    sessionStore.update((state) => ({
      ...state,
      user: user && new User({ ...user }),
      userPreferences: user && new UserPreferences({ ...user.userPreferences }),
    }));
    this._syncPreferences(user?.userPreferences);
  }

  updateUserPreferences(userPreferences: UserPreferences | null) {
    sessionStore.update((state) => ({
      ...state,
      userPreferences: userPreferences && new UserPreferences({ ...userPreferences }),
    }));
    this._syncPreferences(userPreferences);
  }

  private _syncPreferences(userPreferences?: UserPreferences | null) {
    if (userPreferences) {
      themeStore.update((state) => ({
        ...state,
        darkMode: !!userPreferences?.darkMode,
      }));
      localizationStore.update((state) => ({
        ...state,
        contentLanguage: userPreferences.contentLanguage || 'en',
      }));
    }
  }
}
