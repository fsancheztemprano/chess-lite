import { createStore, withProps } from '@ngneat/elf';
import { localStorageStrategy, persistState } from '@ngneat/elf-persist-state';
import { LocalizationProps } from './localization.store.model';

export const localizationStore = createStore(
  { name: 'localization' },
  withProps<LocalizationProps>({ contentLanguage: 'en' }),
);

persistState(localizationStore, { key: 'localization', storage: localStorageStrategy });
