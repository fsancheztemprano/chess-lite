import { HttpHeaderKey } from '@app/ui/shared/domain';
import { defaultTemplate } from '@app/ui/testing';
import { ContentType } from '@hal-form-client';
import { InteractionObject } from '@pact-foundation/pact';
import { HTTPMethod } from '@pact-foundation/pact/src/common/request';
import { eachLike, email, string, uuid } from '@pact-foundation/pact/src/dsl/matchers';

const createGameTemplate = {
  create: {
    method: 'POST',
    target: 'http://localhost/api/ttc/games',
    properties: [{ name: 'opponent', type: 'text', required: true }],
  },
};

const pendingGame = {
  _links: {
    self: { href: 'http://localhost/api/ttc/games/1' },
    ws: { href: 'ws://localhost/api/ttc/games/1' },
  },
  id: uuid(),
  status: 'PENDING', // PENDING, IN_PROGRESS, FINISHED
  players: {
    X: {
      id: uuid(),
      username: string(),
      email: email(),
    },
    O: {
      id: uuid(),
      username: string(),
      email: email(),
      pending: true,
    },
  },
  _templates: { ...defaultTemplate },
};

const inProgressGame = {
  ...pendingGame,
  status: 'IN_PROGRESS',
  turn: 'X',
  board: [
    ['X', 'X', 'O'],
    ['O', 'O', ''],
    ['X', '', ''],
  ],
};

const finishedGame = {
  ...pendingGame,
  status: 'FINISHED',
  board: [
    ['X', 'X', 'O'],
    ['O', 'O', 'X'],
    ['X', 'O', 'X'],
  ],
  result: 'DRAW',
};

const moveTemplate = {
  move: {
    method: 'POST',
    target: 'http://localhost/api/ttc/games/1/moves',
    properties: [
      {
        name: 'cell',
        type: 'string',
        required: true,
        options: {
          inline: ['2,1', '1,2', '2,2'],
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
      path: '/api/ttc/games',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: {
        _links: {
          self: { href: 'http://localhost/api/ttc/games?page=0' },
          first: { href: 'http://localhost/api/ttc/games?page=0' },
          last: { href: 'http://localhost/api/ttc/games?page=1' },
          next: { href: 'http://localhost/api/ttc/games?page=1' },
          prev: { href: 'http://localhost/api/ttc/games?page=0' },
        },
        page: { size: 20, totalElements: 30, totalPages: 2, number: 0 },
        _embedded: {
          ttcGameModelList: eachLike(pendingGame),
        },
        _templates: {
          ...defaultTemplate,
        },
      },
    },
  };

  export const successful_with_create: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get all tic tac toe games with create',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/ttc/games',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: {
        _links: {
          self: { href: 'http://localhost/api/ttc/games?page=0' },
          first: { href: 'http://localhost/api/ttc/games?page=0' },
          last: { href: 'http://localhost/api/ttc/games?page=1' },
          next: { href: 'http://localhost/api/ttc/games?page=1' },
          prev: { href: 'http://localhost/api/ttc/games?page=0' },
        },
        page: { size: 20, totalElements: 30, totalPages: 2, number: 0 },
        _embedded: {
          ttcGameModelList: eachLike(pendingGame),
        },
        _templates: {
          ...defaultTemplate,
          ...createGameTemplate,
        },
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
      path: '/api/ttc/my-games',
      query: 'page=0',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: {
        _links: {
          self: { href: 'http://localhost/api/ttc/my-games?page=0' },
          first: { href: 'http://localhost/api/ttc/my-games?page=0' },
          last: { href: 'http://localhost/api/ttc/my-games?page=1' },
          next: { href: 'http://localhost/api/ttc/my-games?page=1' },
          prev: { href: 'http://localhost/api/ttc/my-games?page=0' },
        },
        page: { size: 20, totalElements: 30, totalPages: 2, number: 0 },
        _embedded: {
          ttcGameModel: eachLike(pendingGame),
        },
        _templates: { ...defaultTemplate },
      },
    },
  };

  export const successful_with_create: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get my tic tac toe games with create',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/ttc/my-games',
      query: 'page=0',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: {
        _links: {
          self: { href: 'http://localhost/api/ttc/my-games?page=0' },
          first: { href: 'http://localhost/api/ttc/my-games?page=0' },
          last: { href: 'http://localhost/api/ttc/my-games?page=1' },
          next: { href: 'http://localhost/api/ttc/my-games?page=1' },
          prev: { href: 'http://localhost/api/ttc/my-games?page=0' },
        },
        page: { size: 20, totalElements: 30, totalPages: 2, number: 0 },
        _embedded: {
          ttcGameModel: eachLike(pendingGame),
        },
        _templates: { ...defaultTemplate, ...createGameTemplate },
      },
    },
  };
}

export namespace CreateTicTacToeGamePact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'create a tic tac toe game',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/ttc/games',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        'Content-Type': ContentType.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        opponent: string(),
      },
    },
    willRespondWith: {
      status: 204,
    },
  };
}

export namespace GetOneTicTacToeGamePact {
  export const pending: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get one tic tac toe game',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/ttc/games/1',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
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
      path: '/api/ttc/games/1',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
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
      path: '/api/ttc/games/1',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
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
    uponReceiving: 'get one tic tac toe game in progress active player',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/ttc/games/1',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
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
}

export namespace MoveTicTacToeGamePact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'make a move a tic tac toe game',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/ttc/games/1/move',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        'Content-Type': ContentType.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        position: string(),
      },
    },
    willRespondWith: {
      status: 204,
    },
  };
}
