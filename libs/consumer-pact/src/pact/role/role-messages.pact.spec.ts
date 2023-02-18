import { ContentType } from '@hal-form-client';
import { MessageConsumerPact, synchronousBodyHandler } from '@pact-foundation/pact';
import { JsonObject, pactForMessages } from '../../utils/pact.utils';
import { RoleChangedMessages } from './role-messages.pact';

const provider: MessageConsumerPact = pactForMessages('roleChanged');

describe('Role Messages Pacts', () => {
  it('should receive a role created message', () => {
    return provider
      .expectsToReceive(`a role created message`)
      .withContent(RoleChangedMessages.roleCreatedMessage as JsonObject)
      .withMetadata({ ['Content-Type']: ContentType.APPLICATION_JSON })
      .verify(
        synchronousBodyHandler((message) => {
          expect(message).toBeTruthy();
          expect((<JsonObject>message).content).toEqual(RoleChangedMessages.roleCreatedMessage);
        }),
      );
  });

  it('should receive a role updated message', () => {
    return provider
      .expectsToReceive(`a role updated message`)
      .withContent(RoleChangedMessages.roleUpdatedMessage as JsonObject)
      .withMetadata({ ['Content-Type']: ContentType.APPLICATION_JSON })
      .verify(
        synchronousBodyHandler((message) => {
          expect(message).toBeTruthy();
          expect((<JsonObject>message).content).toEqual(RoleChangedMessages.roleUpdatedMessage);
        }),
      );
  });

  it('should receive a role deleted message', () => {
    return provider
      .expectsToReceive(`a role deleted message`)
      .withContent(RoleChangedMessages.roleDeletedMessage as JsonObject)
      .withMetadata({ ['Content-Type']: ContentType.APPLICATION_JSON })
      .verify(
        synchronousBodyHandler((message) => {
          expect(message).toBeTruthy();
          expect((<JsonObject>message).content).toEqual(RoleChangedMessages.roleDeletedMessage);
        }),
      );
  });
});
