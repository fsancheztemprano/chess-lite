import { HttpHeaderKey } from '@app/ui/shared/domain';
import { defaultTemplate } from '@app/ui/testing';
import { ContentType } from '@hal-form-client';
import { InteractionObject } from '@pact-foundation/pact';
import { HTTPMethod } from '@pact-foundation/pact/src/common/request';
import { bearer } from '../../../utils/pact.utils';
import { jwtToken } from '../../../utils/token.utils';
import { createGameTemplate } from '../game/ttc-game.pact';

export namespace GetTicTacToeRootResource {
  export const unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get ttc root resource as unauthorized user',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/ttc',
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

  export const as_player: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get ttc root resource as authorized',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/ttc',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['ttc:game'] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: {
        _links: {
          self: { href: 'http://localhost/api/ttc' },
          'my-games': {
            href: 'http://localhost/api/ttc/my-games{?search,page,size,sort}',
            templated: true,
          },
          game: {
            href: 'http://localhost/api/ttc/game/{ttcGameId}',
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

  export const as_admin: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get root resource with authority ttc:game:read',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/ttc',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['ttc:game:read'] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: {
        _links: {
          self: { href: 'http://localhost/api/ttc' },
          'my-games': {
            href: 'http://localhost/api/ttc/my-games{?search,page,size,sort}',
            templated: true,
          },
          game: {
            href: 'http://localhost/api/ttc/game/{ttcGameId}',
            templated: true,
          },
          games: {
            href: 'http://localhost/api/ttc/games{?search,page,size,sort}',
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
