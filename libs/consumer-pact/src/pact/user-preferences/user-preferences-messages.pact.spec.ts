import { UserPreferencesChangedMessage } from '@app/ui/shared/domain';
import { ContentType } from '@hal-form-client';
import { MessageConsumerPact, synchronousBodyHandler } from '@pact-foundation/pact';
import { pactForMessages } from '../../utils/pact.utils';
import { UserPreferencesChangedMessages } from './user-preferences-messages.pact';

const provider: MessageConsumerPact = pactForMessages('userPreferencesChanged');

describe('User Preferences Messages Pacts', () => {
  it('should receive a user preferences updated message', () => {
    return provider
      .expectsToReceive(`a user preferences updated message`)
      .withContent(UserPreferencesChangedMessages.userPreferencesUpdatedMessage)
      .withMetadata({ ['Content-Type']: ContentType.APPLICATION_JSON })
      .verify(
        synchronousBodyHandler((message: UserPreferencesChangedMessage) => {
          expect(message).toBeTruthy();
          expect(message).toEqual(UserPreferencesChangedMessages.userPreferencesUpdatedMessage);
        }),
      );
  });
});
