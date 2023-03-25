import { TicTacToeAuthority, TicTacToeGamePlayer } from '@app/ui/shared/domain';
import { ContentType } from '@hal-form-client';
import { InteractionObject } from '@pact-foundation/pact';
import { HTTPMethod } from '@pact-foundation/pact/src/common/request';
import { bearer } from '../../../utils/pact.utils';
import { jwtToken } from '../../../utils/token.utils';

const move1 = {
  id: 'tic-tac-toe-gm1',
  cell: 'B3',
  token: TicTacToeGamePlayer.X,
  board: 'X________',
  number: 1,
  player: {
    id: 'tic-tac-toe-p1',
    username: 'tic-tac-toe-p1',
    wins: 5,
    losses: 3,
    draws: 1,
  },
  movedAt: 6000000,
  moveTime: 5000,
  gameId: 'tic-tac-toe-g2',
};

export namespace MoveTicTacToeGamePact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'make a tic tac toe game move',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/tic-tac-toe/game/tic-tac-toe-g2/move',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        'Content-Type': ContentType.APPLICATION_JSON,
        Authorization: bearer(jwtToken({ authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] })),
      },
      body: {
        cell: 'B3',
      },
    },
    willRespondWith: {
      status: 201,
      body: {
        ...move1,
      },
    },
  };

  export const error_not_found: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'make a tic tac toe game move not found',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/tic-tac-toe/game/tic-tac-toe-g0/move',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        'Content-Type': ContentType.APPLICATION_JSON,
        Authorization: bearer(jwtToken({ authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] })),
      },
      body: {
        cell: 'B3',
      },
    },
    willRespondWith: {
      status: 404,
      body: {
        reason: 'Not Found',
      },
    },
  };

  export const error_unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'make a tic tac toe move unauthorized',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/tic-tac-toe/game/tic-tac-toe-g2/move',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        'Content-Type': ContentType.APPLICATION_JSON,
        Authorization: bearer(jwtToken()),
      },
      body: {
        cell: 'B3',
      },
    },
    willRespondWith: {
      status: 401,
      body: {
        reason: 'Unauthorized',
        title: 'Insufficient permissions',
      },
    },
  };
}
