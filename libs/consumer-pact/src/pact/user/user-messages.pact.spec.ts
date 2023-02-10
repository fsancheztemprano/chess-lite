import { ContentType } from '@hal-form-client';
import { MessageConsumerPact, synchronousBodyHandler } from '@pact-foundation/pact';
import { JsonObject, pactForMessages } from '../../utils/pact.utils';
import { UserChangedMessages } from './user-messages.pact';

const provider: MessageConsumerPact = pactForMessages('userChanged');

describe.skip('User Messages Pacts', () => {
  it('should receive a user created message', () => {
    return provider
      .expectsToReceive(`a user created message`)
      .withContent(<JsonObject>UserChangedMessages.userCreatedMessage)
      .withMetadata({ ['Content-Type']: ContentType.APPLICATION_JSON })
      .verify(
        synchronousBodyHandler((message) => {
          expect(message).toBeTruthy();
          expect((<JsonObject>message).content).toEqual(UserChangedMessages.userCreatedMessage);
        }),
      );
  });

  it('should receive a user updated message', () => {
    return provider
      .expectsToReceive(`a user updated message`)
      .withContent(<JsonObject>UserChangedMessages.userUpdatedMessage)
      .withMetadata({ ['Content-Type']: ContentType.APPLICATION_JSON })
      .verify(
        synchronousBodyHandler((message) => {
          expect(message).toBeTruthy();
          expect((<JsonObject>message).content).toEqual(UserChangedMessages.userUpdatedMessage);
        }),
      );
  });

  it('should receive a user deleted message', () => {
    return provider
      .expectsToReceive(`a user deleted message`)
      .withContent(<JsonObject>UserChangedMessages.userDeletedMessage)
      .withMetadata({ ['Content-Type']: ContentType.APPLICATION_JSON })
      .verify(
        synchronousBodyHandler((message) => {
          expect(message).toBeTruthy();
          expect((<JsonObject>message).content).toEqual(UserChangedMessages.userDeletedMessage);
        }),
      );
  });
});
