import { Injectable } from '@angular/core';
import { createStore, select, withProps } from '@ngneat/elf';
import { localStorageStrategy, persistState } from '@ngneat/elf-persist-state';

export interface ThemeProps {
  darkMode: boolean;
}

export const themeStore = createStore({ name: 'theme' }, withProps<ThemeProps>({ darkMode: false }));

persistState(themeStore, { key: 'theme', storage: localStorageStrategy });

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
