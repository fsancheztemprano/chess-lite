import { HttpHeaderKey, TicTacToeAuthority, TicTacToeGameResult } from '@app/ui/shared/domain';
import { defaultTemplate } from '@app/ui/testing';
import { ContentType } from '@hal-form-client';
import { InteractionObject } from '@pact-foundation/pact';
import { HTTPMethod } from '@pact-foundation/pact/src/common/request';
import { boolean, eachLike, email, string, uuid } from '@pact-foundation/pact/src/dsl/matchers';
import { bearer } from '../../../utils/pact.utils';
import { jwtToken } from '../../../utils/token.utils';

export const createGameTemplate = {
  create: {
    method: 'POST',
    target: '/api/tic-tac-toe/games',
    properties: [
      { name: 'oId', type: 'text', required: true },
      { name: 'xId', type: 'text', required: true },
      { name: 'private', type: 'boolean' },
    ],
  },
};

const pendingGame = {
  _links: {
    self: { href: 'http://localhost/api/tic-tac-toe/games/tic-tac-toe-g1' },
    ws: { href: 'ws://localhost/api/tic-tac-toe/games/tic-tac-toe-g1' },
  },
  id: uuid(),
  status: 'PENDING',
  private: true,
  players: {
    x: {
      id: 'user-a-id',
      username: string(),
      email: email(),
    },
    o: {
      id: 'user-b-id',
      username: string(),
      email: email(),
      active: true,
    },
  },
  _templates: { ...defaultTemplate },
};

const inProgressGame = {
  ...pendingGame,
  status: 'IN_PROGRESS',
  players: {
    x: { ...pendingGame.players.x, active: true },
    o: { ...pendingGame.players.o, active: false },
  },
  board: [
    ['x', 'x', 'o'],
    ['o', 'o', ''],
    ['x', '', ''],
  ],
};

const finishedGame = {
  ...pendingGame,
  status: 'FINISHED',
  players: {
    x: { ...pendingGame.players.x, active: false },
    o: { ...pendingGame.players.o, active: false },
  },
  board: [
    ['x', 'x', 'o'],
    ['o', 'o', 'o'],
    ['x', '', 'x'],
  ],
  result: TicTacToeGameResult.O_WON,
};

export const moveTemplate = {
  move: {
    method: 'POST',
    target: '/api/tic-tac-toe/games/tic-tac-toe-g1/move',
    properties: [
      {
        name: 'cell',
        type: 'string',
        required: true,
        options: {
          inline: ['B1', 'C1', 'B2'],
        },
      },
    ],
  },
};

export namespace GetAllTicTacToeGamesPact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get all tic tac toe games',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/tic-tac-toe/games',
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
          self: { href: 'http://localhost/api/tic-tac-toe/games?page=0' },
          first: { href: 'http://localhost/api/tic-tac-toe/games?page=0' },
          last: { href: 'http://localhost/api/tic-tac-toe/games?page=1' },
          next: { href: 'http://localhost/api/tic-tac-toe/games?page=1' },
          prev: { href: 'http://localhost/api/tic-tac-toe/games?page=0' },
        },
        page: { size: 20, totalElements: 30, totalPages: 2, number: 0 },
        _embedded: {
          ticTacToeGameModelList: eachLike(pendingGame),
        },
        _templates: {
          ...defaultTemplate,
        },
      },
    },
  };

  export const error_unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get all tic tac toe games unauthorized',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/tic-tac-toe/games',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] })),
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

export namespace GetMyTicTacToeGamesPact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get my tic tac toe games',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/tic-tac-toe/my-games',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(
          jwtToken({
            user: { id: 'user-a-id' },
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
          ticTacToeGameModelList: eachLike(pendingGame),
        },
        _templates: { ...defaultTemplate },
      },
    },
  };

  export const error_unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get my tic tac toe games unauthorized',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/tic-tac-toe/my-games',
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
  export const successful_as_player: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'create a tic tac toe game as player',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/tic-tac-toe/games',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        'Content-Type': ContentType.APPLICATION_JSON,
        Authorization: bearer(
          jwtToken({
            user: { id: 'user-a-id' },
            authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT],
          }),
        ),
      },
      body: {
        xId: 'user-a-id',
        oId: 'user-b-id',
        private: boolean(),
      },
    },
    willRespondWith: {
      status: 204,
    },
  };

  export const successful_as_admin: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'create a tic tac toe game as admin',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/tic-tac-toe/games',
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
        xId: 'user-a-id',
        oId: 'user-b-id',
        private: boolean(),
      },
    },
    willRespondWith: {
      status: 204,
    },
  };

  export const error_not_admin: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'create a tic tac toe game with initiator as player',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/tic-tac-toe/games',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        'Content-Type': ContentType.APPLICATION_JSON,
        Authorization: bearer(
          jwtToken({
            user: { id: 'user-a-id' },
            authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT],
          }),
        ),
      },
      body: {
        xId: 'user-b-id',
        oId: 'user-c-id',
        private: boolean(),
      },
    },
    willRespondWith: {
      status: 400,
      body: {
        reason: 'Bad Request',
      },
    },
  };

  export const error_unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'create a tic tac toe game unauthorized',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/tic-tac-toe/games',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        'Content-Type': ContentType.APPLICATION_JSON,
        Authorization: bearer(jwtToken()),
      },
      body: {
        xId: 'user-a-id',
        oId: 'user-b-id',
        private: boolean(),
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

  export const error_no_opponent: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'create a tic tac toe game when rival is same as initiator',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/tic-tac-toe/games',
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
        xId: 'user-a-id',
        oId: 'user-a-id',
        private: boolean(),
      },
    },
    willRespondWith: {
      status: 400,
      body: {
        reason: 'Bad Request',
      },
    },
  };
}

export namespace GetOneTicTacToeGamePact {
  export const private_as_admin: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get one private tic tac toe game with tic-tac-toe:game:read as admin',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/tic-tac-toe/games/tic-tac-toe-g1',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: [TicTacToeAuthority.TIC_TAC_TOE_GAME_READ] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: { ...pendingGame },
    },
  };

  export const private_as_player: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get one private tic tac toe game with as player',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/tic-tac-toe/games/tic-tac-toe-g1',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(
          jwtToken({
            user: { id: 'user-a-id' },
            authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT],
          }),
        ),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: { ...pendingGame },
    },
  };

  export const private_as_viewer: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get one private tic tac toe game as viewer',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/tic-tac-toe/games/tic-tac-toe-g1',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(
          jwtToken({
            user: { id: 'user-c-id' },
            authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT],
          }),
        ),
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

  export const public_as_viewer: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get one public tic tac toe game as viewer',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/tic-tac-toe/games/tic-tac-toe-g2',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(
          jwtToken({
            user: { id: 'user-c-id' },
            authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT],
          }),
        ),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: { ...pendingGame },
    },
  };

  export const in_progress_inactive_player: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get one tic tac toe game in progress inactive player',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/tic-tac-toe/games/tic-tac-toe-g1',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(
          jwtToken({
            user: { id: 'user-b-id' },
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
      },
    },
  };

  export const in_progress_active_player: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get one tic tac toe game in progress active player',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/tic-tac-toe/games/tic-tac-toe-g1',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(
          jwtToken({
            user: { id: 'user-a-id' },
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

  export const finished: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get one tic tac toe game finished',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/tic-tac-toe/games/tic-tac-toe-g1',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(
          jwtToken({
            user: { id: 'user-a-id' },
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
      path: '/api/tic-tac-toe/games/tic-tac-toe-g0',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] })),
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

  export const error_unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get one tic tac toe game unauthorized',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/tic-tac-toe/games/tic-tac-toe-g1',
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

export namespace MoveTicTacToeGamePact {
  export const successful_as_admin: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'make a move a tic tac toe game as admin',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/tic-tac-toe/games/tic-tac-toe-g1/move',
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
      status: 204,
    },
  };

  export const successful_as_player: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'make a move a tic tac toe game as active player',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/tic-tac-toe/games/tic-tac-toe-g1/move',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        'Content-Type': ContentType.APPLICATION_JSON,
        Authorization: bearer(
          jwtToken({
            user: { id: 'user-a-id' },
            authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT],
          }),
        ),
      },
      body: {
        cell: 'A2',
      },
    },
    willRespondWith: {
      status: 204,
    },
  };

  export const error_as_inactive_player: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'make a move a tic tac toe game as inactive player',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/tic-tac-toe/games/tic-tac-toe-g1/move',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        'Content-Type': ContentType.APPLICATION_JSON,
        Authorization: bearer(
          jwtToken({
            user: { id: 'user-b-id' },
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
      path: '/api/tic-tac-toe/games/tic-tac-toe-g1/move',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        'Content-Type': ContentType.APPLICATION_JSON,
        Authorization: bearer(
          jwtToken({
            user: { id: 'user-c-id' },
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
      path: '/api/tic-tac-toe/games/tic-tac-toe-g1/move',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        'Content-Type': ContentType.APPLICATION_JSON,
        Authorization: bearer(
          jwtToken({
            user: { id: 'user-a-id' },
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
      path: '/api/tic-tac-toe/games/tic-tac-toe-g2/move',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        'Content-Type': ContentType.APPLICATION_JSON,
        Authorization: bearer(
          jwtToken({
            user: { id: 'user-a-id' },
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
      path: '/api/tic-tac-toe/games/tic-tac-toe-g0/move',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        'Content-Type': ContentType.APPLICATION_JSON,
        Authorization: bearer(
          jwtToken({
            user: { id: 'user-a-id' },
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
      path: '/api/tic-tac-toe/games/tic-tac-toe-g2/move',
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
