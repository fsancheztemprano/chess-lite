import { HttpHeaderKey, TicTacToeAuthority } from '@app/ui/shared/domain';
import { defaultTemplate } from '@app/ui/testing';
import { ContentType } from '@hal-form-client';
import { InteractionObject } from '@pact-foundation/pact';
import { HTTPMethod } from '@pact-foundation/pact/src/common/request';
import { bearer } from '../../../utils/pact.utils';
import { jwtToken } from '../../../utils/token.utils';
import { createGameTemplate } from '../game/tic-tac-toe-game.pact';

export namespace GetTicTacToeRootResource {
  export const unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get tic-tac-toe root resource as unauthorized user',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/tic-tac-toe',
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

  export const successfull: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get root resource with authority tic-tac-toe:root',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/tic-tac-toe',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: [TicTacToeAuthority.TIC_TAC_TOE_ROOT] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: {
        _links: {
          self: { href: 'http://localhost/api/tic-tac-toe' },
          root: {
            href: 'http://localhost/api',
          },
          game: {
            href: 'http://localhost/api/tic-tac-toe/game/{gameId}',
            templated: true,
          },
          games: {
            href: 'http://localhost/api/tic-tac-toe/game{?myGames,isPrivate,player,status,page,size,sort}',
            templated: true,
          },
          players: {
            href: 'http://localhost/api/tic-tac-toe/player{?username}',
            templated: true,
          },
          create: {
            href: 'http://localhost/api/tic-tac-toe/game',
          },
          'ws:games': {
            href: '/ami/tic-tac-toe/game',
          },
          'ws:game:player': {
            href: '/ami/tic-tac-toe/game/player/{playerId}',
            templated: true,
          },
        },
        _templates: {
          ...defaultTemplate,
          ...createGameTemplate,
        },
      },
    },
  };
}
