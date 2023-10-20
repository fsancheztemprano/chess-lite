import { UserPreferencesChangedMessage, UserPreferencesChangedMessageAction } from '@app/ui/shared/domain';
import { JsonMap } from '@pact-foundation/pact/src/common/jsonTypes';

export namespace UserPreferencesChangedMessages {
  export const userPreferencesUpdatedMessage: UserPreferencesChangedMessage & JsonMap = {
    userPreferencesId: 'up1',
    action: UserPreferencesChangedMessageAction.UPDATED,
  };
}
