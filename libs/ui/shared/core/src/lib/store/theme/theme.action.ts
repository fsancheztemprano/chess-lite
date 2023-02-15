import { IThemeModel } from '@app/ui/shared/domain';
import { actionsFactory, props } from '@ngneat/effects';

const sessionActions = actionsFactory('Theme');

export const updateDarkMode = sessionActions.create('Update Dark Mode', props<{ darkMode?: boolean }>());
export const updateTheme = sessionActions.create('Update Theme', props<IThemeModel>());
