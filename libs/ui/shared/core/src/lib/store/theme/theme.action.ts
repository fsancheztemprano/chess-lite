import { actionsFactory, props } from '@ngneat/effects';

const sessionActions = actionsFactory('Theme');

export const updateDarkMode = sessionActions.create('Update Dark Mode', props<{ darkMode: boolean }>());
