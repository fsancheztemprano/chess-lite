import { ApplicationMessage, MessageDestination } from './message.model';

export interface UserChangedMessage extends ApplicationMessage {
  userId: string;
  action: UserChangedMessageAction;
}

export enum UserChangedMessageAction {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
}

export class UsersListChangedMessageDestination implements MessageDestination {
  getDestination(): string {
    return '/ami/user';
  }
}

export class UserChangedMessageDestination implements MessageDestination {
  constructor(private readonly userId: string) {}

  getDestination(): string {
    return `/ami/user/${this.userId}`;
  }
}
