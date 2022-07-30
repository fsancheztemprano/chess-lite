import { RoleChangedMessage, RoleChangedMessageAction } from '@app/ui/shared/domain';

export namespace RoleChangedMessages {
  export const roleCreatedMessage: RoleChangedMessage = {
    roleId: 'r1',
    action: RoleChangedMessageAction.CREATED,
  };

  export const roleUpdatedMessage: RoleChangedMessage = {
    roleId: 'r2',
    action: RoleChangedMessageAction.UPDATED,
  };

  export const roleDeletedMessage: RoleChangedMessage = {
    roleId: 'r3',
    action: RoleChangedMessageAction.DELETED,
  };
}
