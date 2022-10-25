import { Injectable } from '@angular/core';
import { updateSession } from '@app/ui/shared/app';
import { LocalizationRepository, updateContentLanguage } from '@app/ui/shared/core';
import { createEffect, ofType } from '@ngneat/effects';
import { filterNil } from '@ngneat/elf';
import { map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LocalizationEffects {
  constructor(private readonly localizationRepository: LocalizationRepository) {}

  updateContentLanguage$ = createEffect((actions) =>
    actions.pipe(
      ofType(updateContentLanguage),
      tap(({ contentLanguage }) => this.localizationRepository.updateContentLanguage(contentLanguage)),
    ),
  );

  syncUserPreferencesContentLanguage$ = createEffect((actions) =>
    actions.pipe(
      ofType(updateSession),
      map(({ user, userPreferences }) => (user && user.userPreferences) || userPreferences),
      filterNil(),
      tap(({ contentLanguage }) => this.localizationRepository.updateContentLanguage(contentLanguage || 'en')),
    ),
  );
}
