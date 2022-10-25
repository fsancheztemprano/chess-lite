import { ApplicationMessage } from './message.model';

export interface GlobalSettingsChangedMessage extends ApplicationMessage {
  action: GlobalSettingsChangedMessageAction;
}

export enum GlobalSettingsChangedMessageAction {
  UPDATED = 'UPDATED',
}
