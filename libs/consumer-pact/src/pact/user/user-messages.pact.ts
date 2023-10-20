import { UserChangedMessage, UserChangedMessageAction } from '@app/ui/shared/domain';
import { JsonMap } from '@pact-foundation/pact/src/common/jsonTypes';

export namespace UserChangedMessages {
  export const userCreatedMessage: UserChangedMessage & JsonMap = {
    userId: 'u1',
    username: 'u1',
    action: UserChangedMessageAction.CREATED,
  };

  export const userUpdatedMessage: UserChangedMessage & JsonMap = {
    userId: 'u2',
    username: 'u2',
    action: UserChangedMessageAction.UPDATED,
  };

  export const userDeletedMessage: UserChangedMessage & JsonMap = {
    userId: 'u3',
    username: 'u3',
    action: UserChangedMessageAction.DELETED,
  };
}
