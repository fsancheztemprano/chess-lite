import { Injectable } from '@angular/core';
import { select } from '@ngneat/elf';
import { themeStore } from './theme.store';

@Injectable({ providedIn: 'root' })
export class ThemeRepository {
  darkMode$ = themeStore.pipe(select((state) => state.darkMode));

  public updateDarkMode(darkMode: boolean): void {
    themeStore.update((state) => {
      return {
        ...state,
        darkMode,
      };
    });
  }
}
