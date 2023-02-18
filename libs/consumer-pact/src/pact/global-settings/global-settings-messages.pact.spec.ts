import { ContentType } from '@hal-form-client';
import { MessageConsumerPact, synchronousBodyHandler } from '@pact-foundation/pact';
import { JsonObject, pactForMessages } from '../../utils/pact.utils';
import { GlobalSettingsChangedMessages } from './global-settings-messages.pact';

const provider: MessageConsumerPact = pactForMessages('globalSettingsChanged');

describe('Global Settings Messages Pacts', () => {
  it('should receive a global settings updated message', () => {
    return provider
      .expectsToReceive(`a global settings updated message`)
      .withContent(GlobalSettingsChangedMessages.globalSettingsUpdatedMessage as JsonObject)
      .withMetadata({ ['Content-Type']: ContentType.APPLICATION_JSON })
      .verify(
        synchronousBodyHandler((message) => {
          expect(message).toBeTruthy();
          expect((<JsonObject>message).content).toEqual(GlobalSettingsChangedMessages.globalSettingsUpdatedMessage);
        }),
      );
  });
});
