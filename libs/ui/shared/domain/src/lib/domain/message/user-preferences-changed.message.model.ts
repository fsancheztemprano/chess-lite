import { ApplicationMessage } from './message.model';

export interface UserPreferencesChangedMessage extends ApplicationMessage {
  userPreferencesId: string;
  action: UserPreferencesChangedMessageAction;
}

export enum UserPreferencesChangedMessageAction {
  UPDATED = 'UPDATED',
}
