import { GlobalSettingsChangedMessage, GlobalSettingsChangedMessageAction } from '@app/ui/shared/domain';

export namespace GlobalSettingsChangedMessages {
  export const globalSettingsUpdatedMessage: GlobalSettingsChangedMessage = {
    action: GlobalSettingsChangedMessageAction.UPDATED,
  };
}
