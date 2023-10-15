import { GlobalSettingsChangedMessage, GlobalSettingsChangedMessageAction } from '@app/ui/shared/domain';
import { JsonMap } from '@pact-foundation/pact/src/common/jsonTypes';

export namespace GlobalSettingsChangedMessages {
  export const globalSettingsUpdatedMessage: GlobalSettingsChangedMessage & JsonMap = {
    action: GlobalSettingsChangedMessageAction.UPDATED,
  };
}
