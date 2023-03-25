import { TicTacToeAuthority } from '@app/ui/shared/domain';
import { ContentType } from '@hal-form-client';
import { InteractionObject } from '@pact-foundation/pact';
import { HTTPMethod } from '@pact-foundation/pact/src/common/request';
import { bearer } from '../../../utils/pact.utils';
import { jwtToken } from '../../../utils/token.utils';

export namespace MoveTicTacToeGamePact {
  export const successful_as_admin: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'make a move a tic tac toe game as admin',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/tic-tac-toe/game/tic-tac-toe-g2/move',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        'Content-Type': ContentType.APPLICATION_JSON,
        Authorization: bearer(jwtToken({ authorities: [TicTacToeAuthority.TIC_TAC_TOE_GAME_MOVE] })),
      },
      body: {
        cell: 'A2',
      },
    },
    willRespondWith: {
      status: 202,
    },
  };

  export const successful_as_player: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'make a move a tic tac toe game as active player',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/tic-tac-toe/game/tic-tac-toe-g2/move',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        'Content-Type': ContentType.APPLICATION_JSON,
        Authorization: bearer(
          jwtToken({
            user: { id: 'tic-tac-toe-p1' },
            authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT],
          }),
        ),
      },
      body: {
        cell: 'A2',
      },
    },
    willRespondWith: {
      status: 202,
    },
  };

  export const error_as_inactive_player: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'make a move a tic tac toe game as inactive player',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/tic-tac-toe/game/tic-tac-toe-g2/move',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        'Content-Type': ContentType.APPLICATION_JSON,
        Authorization: bearer(
          jwtToken({
            user: { id: 'tic-tac-toe-p2' },
            authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT],
          }),
        ),
      },
      body: {
        cell: 'A2',
      },
    },
    willRespondWith: {
      status: 400,
      body: {
        title: 'Bad Request',
        reason: 'Not your turn',
      },
    },
  };

  export const error_as_viewer: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'make a move a tic tac toe game as viewer',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/tic-tac-toe/game/tic-tac-toe-g2/move',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        'Content-Type': ContentType.APPLICATION_JSON,
        Authorization: bearer(
          jwtToken({
            user: { id: 'tic-tac-toe-p3' },
            authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT],
          }),
        ),
      },
      body: {
        cell: 'A2',
      },
    },
    willRespondWith: {
      status: 403,
      body: {
        reason: 'Forbidden',
        title: 'Insufficient permissions',
      },
    },
  };

  export const error_cell_is_occupied: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'make a move a tic tac toe game cell is occupied',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/tic-tac-toe/game/tic-tac-toe-g2/move',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        'Content-Type': ContentType.APPLICATION_JSON,
        Authorization: bearer(
          jwtToken({
            user: { id: 'tic-tac-toe-p1' },
            authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT],
          }),
        ),
      },
      body: {
        cell: 'A1',
      },
    },
    willRespondWith: {
      status: 400,
      body: {
        title: 'Bad Request',
        reason: 'Cell is occupied',
      },
    },
  };

  export const error_game_finished: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'make a move a tic tac toe game finished',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/tic-tac-toe/game/tic-tac-toe-g4/move',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        'Content-Type': ContentType.APPLICATION_JSON,
        Authorization: bearer(
          jwtToken({
            user: { id: 'tic-tac-toe-p3' },
            authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT],
          }),
        ),
      },
      body: {
        cell: 'A1',
      },
    },
    willRespondWith: {
      status: 400,
      body: {
        title: 'Bad Request',
        reason: 'Game is Over',
      },
    },
  };

  export const error_not_found: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'make a move a tic tac toe game not found',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/tic-tac-toe/game/tic-tac-toe-g0/move',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        'Content-Type': ContentType.APPLICATION_JSON,
        Authorization: bearer(
          jwtToken({
            user: { id: 'tic-tac-toe-p1' },
            authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT],
          }),
        ),
      },
      body: {
        cell: 'A1',
      },
    },
    willRespondWith: {
      status: 404,
      body: {
        title: 'Not Found',
      },
    },
  };

  export const error_unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'make a move a tic tac toe unauthorized',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/tic-tac-toe/game/tic-tac-toe-g2/move',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        'Content-Type': ContentType.APPLICATION_JSON,
        Authorization: bearer(jwtToken()),
      },
      body: {
        cell: 'A1',
      },
    },
    willRespondWith: {
      status: 401,
      body: {
        title: 'Unauthorized',
      },
    },
  };
}
