import { Session } from '@app/ui/shared/domain';
import { actionsFactory, props } from '@ngneat/effects';
import { SessionProps } from './session.store.model';

const sessionActions = actionsFactory('Session');

export const clearSession = sessionActions.create('Clear Session');
export const initializeSession = sessionActions.create('Initialize Session', props<{ session?: Session }>());
export const updateSession = sessionActions.create('Update Session', props<SessionProps>());
