import { ContentType } from '@hal-form-client';
import { MessageConsumerPact, synchronousBodyHandler } from '@pact-foundation/pact';
import { JsonObject, pactForMessages } from '../../utils/pact.utils';
import { UserPreferencesChangedMessages } from './user-preferences-messages.pact';

const provider: MessageConsumerPact = pactForMessages('userPreferencesChanged');

describe.skip('User Preferences Messages Pacts', () => {
  it('should receive a user preferences updated message', () => {
    return provider
      .expectsToReceive(`a user preferences updated message`)
      .withContent(<JsonObject>UserPreferencesChangedMessages.userPreferencesUpdatedMessage)
      .withMetadata({ ['Content-Type']: ContentType.APPLICATION_JSON })
      .verify(
        synchronousBodyHandler((message) => {
          expect(message).toBeTruthy();
          expect((<JsonObject>message).content).toEqual(UserPreferencesChangedMessages.userPreferencesUpdatedMessage);
        }),
      );
  });
});
