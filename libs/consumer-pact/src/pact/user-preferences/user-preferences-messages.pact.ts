import { UserPreferencesChangedMessage, UserPreferencesChangedMessageAction } from '@app/ui/shared/domain';

export namespace UserPreferencesChangedMessages {
  export const userPreferencesUpdatedMessage: UserPreferencesChangedMessage = {
    userPreferencesId: 'up1',
    action: UserPreferencesChangedMessageAction.UPDATED,
  };
}
