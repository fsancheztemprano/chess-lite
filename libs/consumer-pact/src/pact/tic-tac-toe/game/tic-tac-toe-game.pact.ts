import { HttpHeaderKey, TicTacToeAuthority, TicTacToeGamePlayer, TicTacToeGameStatus } from '@app/ui/shared/domain';
import { defaultTemplate } from '@app/ui/testing';
import { ContentType, ITemplate } from '@hal-form-client';
import { InteractionObject } from '@pact-foundation/pact';
import { HTTPMethod } from '@pact-foundation/pact/src/common/request';
import { boolean } from '@pact-foundation/pact/src/dsl/matchers';
import { bearer } from '../../../utils/pact.utils';
import { jwtToken } from '../../../utils/token.utils';

export const createGameTemplate: { create: ITemplate } = {
  create: {
    method: 'POST',
    target: 'http://localhost/api/tic-tac-toe/game',
    properties: [
      { name: 'playerOUsername', type: 'text', required: true },
      { name: 'isPrivate', type: 'boolean' },
    ],
  },
};

export const adminCreateGameTemplate: { create: ITemplate } = {
  create: {
    ...createGameTemplate.create,
    properties: [...(createGameTemplate.create.properties || []), { name: 'playerXUsername', type: 'text' }],
  },
};

function gameWitId(gameId: string, movesLink = false) {
  return {
    _links: {
      self: { href: `http://localhost/api/tic-tac-toe/game/${gameId}` },
      ws: { href: `/ami/tic-tac-toe/game/${gameId}` },
      ...(movesLink ? { moves: { href: `http://localhost/api/tic-tac-toe/game/${gameId}/move` } } : {}),
    },
    id: `${gameId}`,
    _templates: { ...defaultTemplate },
  };
}

const pendingGame = {
  ...gameWitId('tic-tac-toe-g1'),
  status: 'PENDING',
  isPrivate: true,
  requestedAt: 1000000,
  lastActivityAt: 1000000,
  playerX: {
    id: 'tic-tac-toe-p1',
    username: 'tic-tac-toe-p1',
    wins: 0,
    losses: 0,
    draws: 0,
  },
  playerO: {
    id: 'tic-tac-toe-p2',
    username: 'tic-tac-toe-p2',
    wins: 0,
    losses: 0,
    draws: 0,
  },
  _templates: { ...defaultTemplate },
};

const inProgressGame = {
  ...pendingGame,
  ...gameWitId('tic-tac-toe-g2', true),
  status: 'IN_PROGRESS',
  isPrivate: false,
  startedAt: 2000000,
  lastActivityAt: 2000000,
  turn: TicTacToeGamePlayer.X,
  board: 'XXOOO_X__',
};

const rejectedGame = {
  ...pendingGame,
  ...gameWitId('tic-tac-toe-g3'),
  status: 'REJECTED',
  isPrivate: true,
  lastActivityAt: 3000000,
};

const finishedGame = {
  ...inProgressGame,
  ...gameWitId('tic-tac-toe-g4', true),
  status: 'FINISHED',
  finishedAt: 4000000,
  lastActivityAt: 4000000,
  board: 'XXOOOOX_X',
  turn: TicTacToeGamePlayer.O,
};

export const moveTemplate: { move: ITemplate } = {
  move: {
    method: 'POST',
    target: 'http://localhost/api/tic-tac-toe/game/tic-tac-toe-g2/move',
    properties: [
      {
        name: 'cell',
        regex: '^(B3|C2|C3)$',
        required: true,
        type: 'text',
      },
    ],
  },
};

export const statusTemplate: { status: ITemplate } = {
  status: {
    method: 'PATCH',
    properties: [
      {
        name: 'status',
        type: 'text',
        regex: '^(REJECTED|IN_PROGRESS)$',
      },
    ],
  },
};

export namespace GetAllTicTacToeGamesPact {
  export const all_for_admin: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get all tic tac toe games',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/tic-tac-toe/game',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: [TicTacToeAuthority.TIC_TAC_TOE_GAME_READ] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: {
        _links: {
          self: { href: 'http://localhost/api/tic-tac-toe/game?page=0' },
          first: { href: 'http://localhost/api/tic-tac-toe/game?page=0' },
          last: { href: 'http://localhost/api/tic-tac-toe/game?page=1' },
          next: { href: 'http://localhost/api/tic-tac-toe/game?page=1' },
          prev: { href: 'http://localhost/api/tic-tac-toe/game?page=0' },
        },
        page: { size: 20, totalElements: 30, totalPages: 2, number: 0 },
        _embedded: {
          ticTacToeGameModels: [pendingGame, inProgressGame, rejectedGame, finishedGame],
        },
        _templates: {
          ...defaultTemplate,
        },
      },
    },
  };

  export const affected_or_public_for_player: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get my tic tac toe games and public games',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/tic-tac-toe/game',
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
        _links: {
          self: { href: 'http://localhost/api/tic-tac-toe/my-games?page=0' },
          first: { href: 'http://localhost/api/tic-tac-toe/my-games?page=0' },
          last: { href: 'http://localhost/api/tic-tac-toe/my-games?page=1' },
          next: { href: 'http://localhost/api/tic-tac-toe/my-games?page=1' },
          prev: { href: 'http://localhost/api/tic-tac-toe/my-games?page=0' },
        },
        page: { size: 20, totalElements: 30, totalPages: 2, number: 0 },
        _embedded: {
          ticTacToeGameModels: [pendingGame, inProgressGame, finishedGame],
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
      status: 403,
      body: {
        reason: 'Forbidden',
        title: 'Sorry, you do not have permission to access this resource.',
      },
    },
  };
}

export namespace CreateTicTacToeGamePact {
  export const successful_as_player: InteractionObject = {
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
            user: { id: 'tic-tac-toe-p1' },
            authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT],
          }),
        ),
      },
      body: {
        playerXUsername: 'tic-tac-toe-p1',
        playerOUsername: 'tic-tac-toe-p2',
        private: boolean(),
      },
    },
    willRespondWith: {
      status: 204,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: {
        ...pendingGame,
      },
    },
  };

  export const successful_as_admin: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'create a tic tac toe game as admin',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/tic-tac-toe/game',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        'Content-Type': ContentType.APPLICATION_JSON,
        Authorization: bearer(
          jwtToken({
            user: { id: 'admin-id' },
            authorities: [TicTacToeAuthority.TIC_TAC_TOE_GAME_CREATE],
          }),
        ),
      },
      body: {
        playerXUsername: 'tic-tac-toe-p1',
        playerOUsername: 'tic-tac-toe-p2',
        private: boolean(),
      },
    },
    willRespondWith: {
      status: 204,
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
        playerXUsername: 'tic-tac-toe-p1',
        playerOUsername: 'tic-tac-toe-p2',
        private: boolean(),
      },
    },
    willRespondWith: {
      status: 403,
      body: {
        reason: 'Forbidden',
        title: 'Sorry, you do not have permission to access this resource.',
      },
    },
  };

  export const error_no_opponent: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'create a tic tac toe game when rival is same as initiator',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/tic-tac-toe/game',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        'Content-Type': ContentType.APPLICATION_JSON,
        Authorization: bearer(
          jwtToken({
            user: { id: 'admin-id' },
            authorities: [TicTacToeAuthority.TIC_TAC_TOE_GAME_CREATE],
          }),
        ),
      },
      body: {
        playerXUsername: 'tic-tac-toe-p1',
        playerOUsername: 'tic-tac-toe-p1',
        private: boolean(),
      },
    },
    willRespondWith: {
      status: 400,
      body: {
        reason: 'Bad Request',
        title: 'An error has occurred',
        message: 'X and O cannot be the same player',
      },
    },
  };

  export const error_not_found: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'create a tic tac toe game when player is not found',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/tic-tac-toe/game',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        'Content-Type': ContentType.APPLICATION_JSON,
        Authorization: bearer(
          jwtToken({
            user: { id: 'admin-id' },
            authorities: [TicTacToeAuthority.TIC_TAC_TOE_GAME_CREATE],
          }),
        ),
      },
      body: {
        playerOUsername: 'user-x-id',
        private: boolean(),
      },
    },
    willRespondWith: {
      status: 404,
      body: {
        reason: 'Not Found',
        title: 'TicTacToePlayer with id: user-z-id not found',
        message: 'user-z-id',
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
  export const as_admin: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'successfully reject one tic tac toe game as admin',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/tic-tac-toe/game/tic-tac-toe-g1',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        'Content-Type': ContentType.APPLICATION_JSON,
        Authorization: bearer(jwtToken({ authorities: [TicTacToeAuthority.TIC_TAC_TOE_GAME_CREATE] })),
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

  export const as_opponent_player: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'accept one tic tac toe game as opponent player',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/tic-tac-toe/game/tic-tac-toe-g1',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        'Content-Type': ContentType.APPLICATION_JSON,
        Authorization: bearer(
          jwtToken({ user: { id: 'tic-tac-toe-p2' }, authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] }),
        ),
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

  export const error_as_viewer: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'accept one tic tac toe game as viewer',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/tic-tac-toe/game/tic-tac-toe-g1',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        'Content-Type': ContentType.APPLICATION_JSON,
        Authorization: bearer(
          jwtToken({ user: { id: 'tic-tac-toe-p3' }, authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] }),
        ),
      },
      body: {
        status: TicTacToeGameStatus.IN_PROGRESS,
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
      status: 403,
      body: {
        reason: 'Forbidden',
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
        title: 'Game not found',
      },
    },
  };
}

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
