import { RoleChangedMessage } from '@app/ui/shared/domain';
import { ContentType } from '@hal-form-client';
import { MessageConsumerPact, synchronousBodyHandler } from '@pact-foundation/pact';
import { pactForMessages } from '../../utils/pact.utils';
import { RoleChangedMessages } from './role-messages.pact';

const provider: MessageConsumerPact = pactForMessages('roleChanged');

describe('Role Messages Pacts', () => {
  it('should receive a role created message', () => {
    return provider
      .expectsToReceive(`a role created message`)
      .withContent(RoleChangedMessages.roleCreatedMessage)
      .withMetadata({ ['Content-Type']: ContentType.APPLICATION_JSON })
      .verify(
        synchronousBodyHandler((message: RoleChangedMessage) => {
          expect(message).toBeTruthy();
          expect(message).toEqual(RoleChangedMessages.roleCreatedMessage);
        }),
      );
  });

  it('should receive a role updated message', () => {
    return provider
      .expectsToReceive(`a role updated message`)
      .withContent(RoleChangedMessages.roleUpdatedMessage)
      .withMetadata({ ['Content-Type']: ContentType.APPLICATION_JSON })
      .verify(
        synchronousBodyHandler((message: RoleChangedMessage) => {
          expect(message).toBeTruthy();
          expect(message).toEqual(RoleChangedMessages.roleUpdatedMessage);
        }),
      );
  });

  it('should receive a role deleted message', () => {
    return provider
      .expectsToReceive(`a role deleted message`)
      .withContent(RoleChangedMessages.roleDeletedMessage)
      .withMetadata({ ['Content-Type']: ContentType.APPLICATION_JSON })
      .verify(
        synchronousBodyHandler((message: RoleChangedMessage) => {
          expect(message).toBeTruthy();
          expect(message).toEqual(RoleChangedMessages.roleDeletedMessage);
        }),
      );
  });
});
