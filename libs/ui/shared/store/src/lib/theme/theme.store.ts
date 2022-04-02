import { createStore, withProps } from '@ngneat/elf';
import { localStorageStrategy, persistState } from '@ngneat/elf-persist-state';
import { ThemeProps } from './theme.store.model';

export const themeStore = createStore({ name: 'theme' }, withProps<ThemeProps>({ darkMode: false }));

persistState(themeStore, { key: 'theme', storage: localStorageStrategy });
