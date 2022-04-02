import { createStore, withProps } from '@ngneat/elf';
import { SessionProps } from './session.store.model';

export const sessionStore = createStore(
  { name: 'session' },
  withProps<SessionProps>({
    user: null,
    userPreferences: null,
  }),
);
