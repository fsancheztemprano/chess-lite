import { ApplicationMessage, MessageDestination } from './message.model';

export type GlobalSettingsChangedMessage = ApplicationMessage;

export class GlobalSettingsChangedMessageDestination implements MessageDestination {
  getDestination(): string {
    return `/ami/global-settings`;
  }
}
