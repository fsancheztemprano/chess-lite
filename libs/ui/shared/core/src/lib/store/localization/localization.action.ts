import { actionsFactory, props } from '@ngneat/effects';

const sessionActions = actionsFactory('Localization');

export const updateContentLanguage = sessionActions.create(
  'Update Content Language',
  props<{ contentLanguage: string }>(),
);
