import { UserChangedMessage, UserChangedMessageAction } from '@app/ui/shared/domain';

export namespace UserChangedMessages {
  export const userCreatedMessage: UserChangedMessage = {
    userId: 'u1',
    username: 'u1',
    action: UserChangedMessageAction.CREATED,
  };

  export const userUpdatedMessage: UserChangedMessage = {
    userId: 'u2',
    username: 'u2',
    action: UserChangedMessageAction.UPDATED,
  };

  export const userDeletedMessage: UserChangedMessage = {
    userId: 'u3',
    username: 'u3',
    action: UserChangedMessageAction.DELETED,
  };
}
