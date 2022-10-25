import { UserChangedMessage } from '@app/ui/shared/domain';
import { ContentType } from '@hal-form-client';
import { MessageConsumerPact, synchronousBodyHandler } from '@pact-foundation/pact';
import { pactForMessages } from '../../utils/pact.utils';
import { UserChangedMessages } from './user-messages.pact';

const provider: MessageConsumerPact = pactForMessages('userChanged');

describe('User Messages Pacts', () => {
  it('should receive a user created message', () => {
    return provider
      .expectsToReceive(`a user created message`)
      .withContent(UserChangedMessages.userCreatedMessage)
      .withMetadata({ ['Content-Type']: ContentType.APPLICATION_JSON })
      .verify(
        synchronousBodyHandler((message: UserChangedMessage) => {
          expect(message).toBeTruthy();
          expect(message).toEqual(UserChangedMessages.userCreatedMessage);
        }),
      );
  });

  it('should receive a user updated message', () => {
    return provider
      .expectsToReceive(`a user updated message`)
      .withContent(UserChangedMessages.userUpdatedMessage)
      .withMetadata({ ['Content-Type']: ContentType.APPLICATION_JSON })
      .verify(
        synchronousBodyHandler((message: UserChangedMessage) => {
          expect(message).toBeTruthy();
          expect(message).toEqual(UserChangedMessages.userUpdatedMessage);
        }),
      );
  });

  it('should receive a user deleted message', () => {
    return provider
      .expectsToReceive(`a user deleted message`)
      .withContent(UserChangedMessages.userDeletedMessage)
      .withMetadata({ ['Content-Type']: ContentType.APPLICATION_JSON })
      .verify(
        synchronousBodyHandler((message: UserChangedMessage) => {
          expect(message).toBeTruthy();
          expect(message).toEqual(UserChangedMessages.userDeletedMessage);
        }),
      );
  });
});
