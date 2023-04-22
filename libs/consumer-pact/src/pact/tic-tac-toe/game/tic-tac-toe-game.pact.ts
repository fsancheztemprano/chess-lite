import { HttpHeaderKey, TicTacToeAuthority, TicTacToeGameStatus } from '@app/ui/shared/domain';
import { defaultTemplate } from '@app/ui/testing';
import { ContentType } from '@hal-form-client';
import { InteractionObject } from '@pact-foundation/pact';
import { HTTPMethod } from '@pact-foundation/pact/src/common/request';
import { boolean } from '@pact-foundation/pact/src/dsl/matchers';
import { bearer } from '../../../utils/pact.utils';
import { jwtToken } from '../../../utils/token.utils';
import {
  finishedGame,
  inProgressGame,
  moveTemplate,
  pendingGame,
  rejectedGame,
  statusTemplate,
} from '../tic-tac-toe.mock';

export namespace GetAllTicTacToeGamesPact {
  export const get_all: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get my tic tac toe games and public games',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/tic-tac-toe/game',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(
          jwtToken({
            authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT],
          }),
        ),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: {
        _links: {
          self: { href: 'http://localhost/api/tic-tac-toe/game' },
        },
        page: { size: 4, totalElements: 4, totalPages: 1, number: 0 },
        _embedded: {
          ticTacToeGameModels: [pendingGame, inProgressGame, rejectedGame, finishedGame],
        },
        _templates: { ...defaultTemplate },
      },
    },
  };

  export const error_unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get all tic tac toe games unauthorized',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/tic-tac-toe/game',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken()),
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

export namespace CreateTicTacToeGamePact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'create a tic tac toe game as player',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/tic-tac-toe/game',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        'Content-Type': ContentType.APPLICATION_JSON,
        Authorization: bearer(
          jwtToken({
            authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT],
          }),
        ),
      },
      body: {
        playerOUsername: 'tic-tac-toe-p2',
        isPrivate: boolean(),
      },
    },
    willRespondWith: {
      status: 201,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: {
        ...pendingGame,
      },
    },
  };

  export const error_unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'create a tic tac toe game unauthorized',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/tic-tac-toe/game',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        'Content-Type': ContentType.APPLICATION_JSON,
        Authorization: bearer(jwtToken()),
      },
      body: {
        playerOUsername: 'tic-tac-toe-p2',
        isPrivate: boolean(),
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

export namespace GetOneTicTacToeGamePact {
  export const pending: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get one tic tac toe pending',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/tic-tac-toe/game/tic-tac-toe-g1',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(
          jwtToken({
            authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT],
          }),
        ),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: {
        ...pendingGame,
        _templates: {
          ...defaultTemplate,
        },
      },
    },
  };

  export const pending_with_user_status: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get one tic tac toe pending with status template',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/tic-tac-toe/game/tic-tac-toe-g1',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(
          jwtToken({
            user: { id: 'tic-tac-toe-p2' },
            authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT],
          }),
        ),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: {
        ...pendingGame,
        _templates: {
          ...defaultTemplate,
          ...statusTemplate,
        },
      },
    },
  };

  export const pending_with_admin_status: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get one tic tac toe pending with admin status template',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/tic-tac-toe/game/tic-tac-toe-g1',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(
          jwtToken({
            authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT, TicTacToeAuthority.TIC_TAC_TOE_GAME_CREATE],
          }),
        ),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: {
        ...pendingGame,
        _templates: {
          ...defaultTemplate,
          ...statusTemplate,
        },
      },
    },
  };

  export const in_progress_inactive: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get one tic tac toe game in progress',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/tic-tac-toe/game/tic-tac-toe-g2',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(
          jwtToken({
            user: { id: 'tic-tac-toe-p2' },
            authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT],
          }),
        ),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: { ...inProgressGame },
    },
  };

  export const in_progress_active_player: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get one tic tac toe game in progress active player',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/tic-tac-toe/game/tic-tac-toe-g2',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(
          jwtToken({
            user: { id: 'tic-tac-toe-p1' },
            authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT],
          }),
        ),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: {
        ...inProgressGame,
        _templates: {
          ...defaultTemplate,
          ...moveTemplate,
        },
      },
    },
  };

  export const rejected: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get one tic tac toe game rejected',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/tic-tac-toe/game/tic-tac-toe-g3',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(
          jwtToken({
            authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT],
          }),
        ),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: {
        ...rejectedGame,
      },
    },
  };

  export const finished: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get one tic tac toe game finished',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/tic-tac-toe/game/tic-tac-toe-g4',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(
          jwtToken({
            authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT],
          }),
        ),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: {
        ...finishedGame,
      },
    },
  };

  export const error_not_found: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get one tic tac toe game not found',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/tic-tac-toe/game/tic-tac-toe-g0',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] })),
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
    uponReceiving: 'get one tic tac toe game unauthorized',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/tic-tac-toe/game/tic-tac-toe-g1',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken()),
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

export namespace PatchOneTicTacToeGamePact {
  export const accept: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'accept one tic tac toe game as opponent player',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/tic-tac-toe/game/tic-tac-toe-g2',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        'Content-Type': ContentType.APPLICATION_JSON,
        Authorization: bearer(jwtToken({ authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] })),
      },
      body: {
        status: TicTacToeGameStatus.IN_PROGRESS,
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: { ...inProgressGame },
    },
  };

  export const reject: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'successfully reject one tic tac toe game',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/tic-tac-toe/game/tic-tac-toe-g3',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        'Content-Type': ContentType.APPLICATION_JSON,
        Authorization: bearer(jwtToken({ authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] })),
      },
      body: {
        status: TicTacToeGameStatus.REJECTED,
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: { ...rejectedGame },
    },
  };

  export const error_unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'accept one tic tac toe game unauthorized',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/tic-tac-toe/game/tic-tac-toe-g1',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        'Content-Type': ContentType.APPLICATION_JSON,
        Authorization: bearer(jwtToken()),
      },
      body: {
        status: TicTacToeGameStatus.IN_PROGRESS,
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

  export const error_not_found: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'accept one tic tac toe game not found',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/tic-tac-toe/game/tic-tac-toe-g0',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        'Content-Type': ContentType.APPLICATION_JSON,
        Authorization: bearer(jwtToken({ authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] })),
      },
      body: {
        status: TicTacToeGameStatus.IN_PROGRESS,
      },
    },
    willRespondWith: {
      status: 404,
      body: {
        reason: 'Not Found',
      },
    },
  };
}
