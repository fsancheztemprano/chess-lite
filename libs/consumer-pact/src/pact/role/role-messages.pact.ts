import { RoleChangedMessage, RoleChangedMessageAction } from '@app/ui/shared/domain';
import { JsonMap } from '@pact-foundation/pact/src/common/jsonTypes';

export namespace RoleChangedMessages {
  export const roleCreatedMessage: RoleChangedMessage & JsonMap = {
    roleId: 'r1',
    action: RoleChangedMessageAction.CREATED,
  };

  export const roleUpdatedMessage: RoleChangedMessage & JsonMap = {
    roleId: 'r2',
    action: RoleChangedMessageAction.UPDATED,
  };

  export const roleDeletedMessage: RoleChangedMessage & JsonMap = {
    roleId: 'r3',
    action: RoleChangedMessageAction.DELETED,
  };
}
