import { actionsFactory, props } from '@ngneat/effects';
import { ColorProps } from './theme.repository';

const sessionActions = actionsFactory('Theme');

export const updateDarkMode = sessionActions.create('Update Dark Mode', props<{ darkMode?: boolean }>());
export const updateTheme = sessionActions.create('Update Theme', props<ColorProps>());
