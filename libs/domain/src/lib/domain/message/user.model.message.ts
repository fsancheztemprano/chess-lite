import { ApplicationMessage, MessageDestination } from './message.model';

export interface UserModelMessage extends ApplicationMessage {
  userId: string;
  action: UserModelMessageAction;
}

export enum UserModelMessageAction {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
}

export class UsersListChangedMessageDestination implements MessageDestination {
  getDestination(): string {
    return '/ami/user';
  }
}

export class UserModelMessageDestination implements MessageDestination {
  constructor(private readonly userId: string) {}

  getDestination(): string {
    return `/ami/user/${this.userId}`;
  }
}
