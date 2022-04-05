import { ApplicationMessage } from './message.model';

export interface UserChangedMessage extends ApplicationMessage {
  userId: string;
  action: UserChangedMessageAction;
}

export enum UserChangedMessageAction {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
}
