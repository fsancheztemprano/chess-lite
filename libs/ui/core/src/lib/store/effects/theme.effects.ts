import { Injectable } from '@angular/core';
import { updateSession } from '@app/ui/shared/app';
import { ThemeRepository, ThemeService, updateDarkMode, updateTheme } from '@app/ui/shared/core';
import { IThemeModel } from '@app/ui/shared/domain';
import { createEffect, ofType } from '@ngneat/effects';
import { filterNil } from '@ngneat/elf';
import { map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeEffects {
  constructor(private readonly themeRepository: ThemeRepository, private readonly themeService: ThemeService) {}

  updateDarkMode$ = createEffect((actions) =>
    actions.pipe(
      ofType(updateDarkMode),
      tap(({ darkMode }) => this.themeRepository.updateDarkMode(!!darkMode)),
    ),
  );

  syncUserPreferencesDarkMode$ = createEffect((actions) =>
    actions.pipe(
      ofType(updateSession),
      map(({ user, userPreferences }) => (user && user.userPreferences) || userPreferences),
      filterNil(),
      tap(({ darkMode }) => this.themeRepository.updateDarkMode(!!darkMode)),
    ),
  );

  updateTheme$ = createEffect((actions) =>
    actions.pipe(
      ofType(updateTheme),
      tap((colors: IThemeModel) => this.themeService.updateAppColors(colors)),
    ),
  );
}
