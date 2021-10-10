import { ApplicationMessage, MessageDestination } from './message.model';

export interface RoleChangedMessage extends ApplicationMessage {
  roleId: string;
  action: RoleChangedMessageAction;
}

export enum RoleChangedMessageAction {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
}

export class RolesListChangedMessageDestination implements MessageDestination {
  getDestination(): string {
    return '/ami/role';
  }
}

export class RoleChangedMessageDestination implements MessageDestination {
  constructor(private readonly roleId: string = '0') {}

  getDestination(): string {
    return `/ami/role/${this.roleId}`;
  }
}
