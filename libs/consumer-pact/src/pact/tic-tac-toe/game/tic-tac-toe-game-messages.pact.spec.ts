import { ContentType } from '@hal-form-client';
import { MessageConsumerPact, synchronousBodyHandler } from '@pact-foundation/pact';
import { pactForMessages } from '../../../utils/pact.utils';
import { TicTacToeGameMessages } from './tic-tac-toe-game-messages.pact';

const provider: MessageConsumerPact = pactForMessages('ticTacToeGameChanged');

describe('Tic Tac Toe Game Messages Pacts', () => {
  it('should receive a tic tac toe game created message', () => {
    return provider
      .expectsToReceive(`a tic tac toe game created message`)
      .withContent(TicTacToeGameMessages.ticTacToeGameCreatedMessage)
      .withMetadata({ ['Content-Type']: ContentType.APPLICATION_JSON })
      .verify(
        synchronousBodyHandler((message) => {
          expect(message).toBeTruthy();
          expect(message).toEqual(TicTacToeGameMessages.ticTacToeGameCreatedMessage);
        }),
      );
  });

  it('should receive a tic tac toe game updated message', () => {
    return provider
      .expectsToReceive(`a tic tac toe game updated message`)
      .withContent(TicTacToeGameMessages.ticTacToeGameUpdatedMessage)
      .withMetadata({ ['Content-Type']: ContentType.APPLICATION_JSON })
      .verify(
        synchronousBodyHandler((message) => {
          expect(message).toBeTruthy();
          expect(message).toEqual(TicTacToeGameMessages.ticTacToeGameUpdatedMessage);
        }),
      );
  });
});
