import { ApplicationMessage, MessageDestination } from './message.model';

export interface UserPreferencesChangedMessage extends ApplicationMessage {
  userPreferencesId: string;
  action: UserPreferencesChangedMessageAction;
}

export enum UserPreferencesChangedMessageAction {
  UPDATED = 'UPDATED',
}

export class UserPreferencesChangedMessageDestination implements MessageDestination {
  constructor(private readonly userId: string) {}

  getDestination(): string {
    return `/ami/user-preferences/${this.userId}`;
  }
}
