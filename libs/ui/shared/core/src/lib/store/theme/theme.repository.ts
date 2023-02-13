import { Injectable } from '@angular/core';
import { createStore, select, setProps, withProps } from '@ngneat/elf';
import { localStorageStrategy, persistState } from '@ngneat/elf-persist-state';

export interface ColorProps {
  primary?: string;
  accent?: string;
  warn?: string;
}

export interface ThemeProps {
  darkMode?: boolean;
  colors?: ColorProps;
}

export const themeStore = createStore({ name: 'theme' }, withProps<ThemeProps>({}));

persistState(themeStore, { key: 'theme', storage: localStorageStrategy });

@Injectable({ providedIn: 'root' })
export class ThemeRepository {
  darkMode$ = themeStore.pipe(select((state) => state.darkMode));
  colors$ = themeStore.pipe(select((state) => state.colors));

  public updateDarkMode(darkMode: boolean): void {
    themeStore.update(setProps({ darkMode }));
  }

  public updateColors(colors?: ColorProps): void {
    themeStore.update(setProps({ colors }));
  }
}
