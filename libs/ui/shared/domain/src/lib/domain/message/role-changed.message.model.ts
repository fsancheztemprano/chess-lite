import { ApplicationMessage } from './message.model';

export interface RoleChangedMessage extends ApplicationMessage {
  roleId: string;
  action: RoleChangedMessageAction;
}

export enum RoleChangedMessageAction {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
}
