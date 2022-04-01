import { Session } from '@app/domain';
import { actionsFactory, props } from '@ngneat/effects';

const sessionActions = actionsFactory('Session');

export const clearSession = sessionActions.create('Clear Session');
export const initialize = sessionActions.create('Initialize Session', props<{ session?: Session }>());
