import { HttpHeaderKey } from '@app/domain';
import { ContentTypeEnum } from '@hal-form-client';
import { InteractionObject } from '@pact-foundation/pact';
import { HTTPMethod } from '@pact-foundation/pact/src/common/request';
import { uuid } from '@pact-foundation/pact/src/dsl/matchers';
import { bearer, withUuid } from 'libs/consumer-pact/src/utils/pact.utils';
import { jwtToken } from 'libs/consumer-pact/src/utils/token.util';

export namespace GetAllAuthoritiesPact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get all authorities',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/authority',
      query: {
        size: '1000',
      },
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['authority:read'] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: {
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        _embedded: {
          authorityModels: [
            {
              id: 'pactUpdateAuthorityId',
              name: 'pact:update',
              _links: {
                self: { href: 'http://localhost/api/authority/pactUpdateAuthorityId' },
                authorities: { href: 'http://localhost/api/authority' },
              },
              _templates: { default: { method: 'HEAD', properties: [] } },
            },
            {
              id: uuid(),
              name: 'pact:read',
              _links: {
                self: { href: withUuid('http://localhost/api/authority/{uuid}') },
                authorities: { href: 'http://localhost/api/authority' },
              },
              _templates: { default: { method: 'HEAD', properties: [] } },
            },
            {
              id: uuid(),
              name: 'pact:delete',
              _links: {
                self: { href: withUuid('http://localhost/api/authority/{uuid}') },
                authorities: { href: 'http://localhost/api/authority' },
              },
              _templates: { default: { method: 'HEAD', properties: [] } },
            },
          ],
        },
        _links: {
          self: {
            href: 'http://localhost/api/authority?page=0&size=1000',
          },
        },
        page: {
          size: 1000,
          totalElements: 3,
          totalPages: 1,
          number: 0,
        },
        _templates: {
          default: { method: 'HEAD', properties: [] },
        },
      },
    },
  };

  export const unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get all authorities unauthorized',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/authority',
      query: {
        size: '1000',
      },
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
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

export namespace GetOneAuthorityPact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get one authority',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/authority/pactUpdateAuthorityId',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['authority:read'] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: {
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        id: 'pactUpdateAuthorityId',
        name: 'pact:update',
        _links: {
          self: { href: 'http://localhost/api/authority/pactUpdateAuthorityId' },
          authorities: { href: 'http://localhost/api/authority' },
        },
        _templates: { default: { method: 'HEAD', properties: [] } },
      },
    },
  };

  export const unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get one authority unauthorized',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/authority/pactUpdateAuthorityId',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
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

  export const not_found: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get one authority not found ',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/authority/notFoundId',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['authority:read'] })),
      },
    },
    willRespondWith: {
      status: 404,
      body: {
        reason: 'Not Found',
        title: 'Authority with id: notFoundId not found',
      },
    },
  };
}
