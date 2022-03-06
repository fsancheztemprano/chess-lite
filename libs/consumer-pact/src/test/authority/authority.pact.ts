import { HttpHeaders } from '@app/domain';
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
        [HttpHeaders.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        _embedded: {
          authorityModels: [
            {
              id: uuid(),
              name: 'profile:update',
              _links: {
                self: { href: withUuid('http://localhost/api/authority/{uuid}') },
                authorities: { href: 'http://localhost/api/authority' },
              },
              _templates: { default: { method: 'HEAD', properties: [] } },
            },
            {
              id: uuid(),
              name: 'profile:read',
              _links: {
                self: { href: withUuid('http://localhost/api/authority/{uuid}') },
                authorities: { href: 'http://localhost/api/authority' },
              },
              _templates: { default: { method: 'HEAD', properties: [] } },
            },
            {
              id: uuid(),
              name: 'profile:delete',
              _links: {
                self: { href: withUuid('http://localhost/api/authority/{uuid}') },
                authorities: { href: 'http://localhost/api/authority' },
              },
              _templates: { default: { method: 'HEAD', properties: [] } },
            },
            {
              id: uuid(),
              name: 'user:read',
              _links: {
                self: { href: withUuid('http://localhost/api/authority/{uuid}') },
                authorities: { href: 'http://localhost/api/authority' },
              },
              _templates: { default: { method: 'HEAD', properties: [] } },
            },
            {
              id: uuid(),
              name: 'user:create',
              _links: {
                self: { href: withUuid('http://localhost/api/authority/{uuid}') },
                authorities: { href: 'http://localhost/api/authority' },
              },
              _templates: { default: { method: 'HEAD', properties: [] } },
            },
            {
              id: uuid(),
              name: 'user:update',
              _links: {
                self: { href: withUuid('http://localhost/api/authority/{uuid}') },
                authorities: { href: 'http://localhost/api/authority' },
              },
              _templates: { default: { method: 'HEAD', properties: [] } },
            },
            {
              id: uuid(),
              name: 'user:update:role',
              _links: {
                self: { href: withUuid('http://localhost/api/authority/{uuid}') },
                authorities: { href: 'http://localhost/api/authority' },
              },
              _templates: { default: { method: 'HEAD', properties: [] } },
            },
            {
              id: uuid(),
              name: 'user:update:authorities',
              _links: {
                self: { href: withUuid('http://localhost/api/authority/{uuid}') },
                authorities: { href: 'http://localhost/api/authority' },
              },
              _templates: { default: { method: 'HEAD', properties: [] } },
            },
            {
              id: uuid(),
              name: 'user:delete',
              _links: {
                self: { href: withUuid('http://localhost/api/authority/{uuid}') },
                authorities: { href: 'http://localhost/api/authority' },
              },
              _templates: { default: { method: 'HEAD', properties: [] } },
            },
            {
              id: uuid(),
              name: 'user:preferences:read',
              _links: {
                self: { href: withUuid('http://localhost/api/authority/{uuid}') },
                authorities: { href: 'http://localhost/api/authority' },
              },
              _templates: { default: { method: 'HEAD', properties: [] } },
            },
            {
              id: uuid(),
              name: 'user:preferences:update',
              _links: {
                self: { href: withUuid('http://localhost/api/authority/{uuid}') },
                authorities: { href: 'http://localhost/api/authority' },
              },
              _templates: { default: { method: 'HEAD', properties: [] } },
            },
            {
              id: uuid(),
              name: 'role:read',
              _links: {
                self: { href: withUuid('http://localhost/api/authority/{uuid}') },
                authorities: { href: 'http://localhost/api/authority' },
              },
              _templates: { default: { method: 'HEAD', properties: [] } },
            },
            {
              id: uuid(),
              name: 'role:create',
              _links: {
                self: { href: withUuid('http://localhost/api/authority/{uuid}') },
                authorities: { href: 'http://localhost/api/authority' },
              },
              _templates: { default: { method: 'HEAD', properties: [] } },
            },
            {
              id: uuid(),
              name: 'role:update',
              _links: {
                self: { href: withUuid('http://localhost/api/authority/{uuid}') },
                authorities: { href: 'http://localhost/api/authority' },
              },
              _templates: { default: { method: 'HEAD', properties: [] } },
            },
            {
              id: uuid(),
              name: 'role:update:core',
              _links: {
                self: { href: withUuid('http://localhost/api/authority/{uuid}') },
                authorities: { href: 'http://localhost/api/authority' },
              },
              _templates: { default: { method: 'HEAD', properties: [] } },
            },
            {
              id: uuid(),
              name: 'role:delete',
              _links: {
                self: { href: withUuid('http://localhost/api/authority/{uuid}') },
                authorities: { href: 'http://localhost/api/authority' },
              },
              _templates: { default: { method: 'HEAD', properties: [] } },
            },
            {
              id: uuid(),
              name: 'authority:create',
              _links: {
                self: { href: withUuid('http://localhost/api/authority/{uuid}') },
                authorities: { href: 'http://localhost/api/authority' },
              },
              _templates: { default: { method: 'HEAD', properties: [] } },
            },
            {
              id: uuid(),
              name: 'authority:read',
              _links: {
                self: { href: withUuid('http://localhost/api/authority/{uuid}') },
                authorities: { href: 'http://localhost/api/authority' },
              },
              _templates: { default: { method: 'HEAD', properties: [] } },
            },
            {
              id: uuid(),
              name: 'authority:update',
              _links: {
                self: { href: withUuid('http://localhost/api/authority/{uuid}') },
                authorities: { href: 'http://localhost/api/authority' },
              },
              _templates: { default: { method: 'HEAD', properties: [] } },
            },
            {
              id: uuid(),
              name: 'authority:delete',
              _links: {
                self: { href: withUuid('http://localhost/api/authority/{uuid}') },
                authorities: { href: 'http://localhost/api/authority' },
              },
              _templates: { default: { method: 'HEAD', properties: [] } },
            },
            {
              id: uuid(),
              name: 'admin:root',
              _links: {
                self: { href: withUuid('http://localhost/api/authority/{uuid}') },
                authorities: { href: 'http://localhost/api/authority' },
              },
              _templates: { default: { method: 'HEAD', properties: [] } },
            },
            {
              id: uuid(),
              name: 'admin:user-management:root',
              _links: {
                self: { href: withUuid('http://localhost/api/authority/{uuid}') },
                authorities: { href: 'http://localhost/api/authority' },
              },
              _templates: { default: { method: 'HEAD', properties: [] } },
            },
            {
              id: uuid(),
              name: 'admin:role-management:root',
              _links: {
                self: { href: withUuid('http://localhost/api/authority/{uuid}') },
                authorities: { href: 'http://localhost/api/authority' },
              },
              _templates: { default: { method: 'HEAD', properties: [] } },
            },
            {
              id: uuid(),
              name: 'service-logs:read',
              _links: {
                self: { href: withUuid('http://localhost/api/authority/{uuid}') },
                authorities: { href: 'http://localhost/api/authority' },
              },
              _templates: { default: { method: 'HEAD', properties: [] } },
            },
            {
              id: uuid(),
              name: 'service-logs:delete',
              _links: {
                self: { href: withUuid('http://localhost/api/authority/{uuid}') },
                authorities: { href: 'http://localhost/api/authority' },
              },
              _templates: { default: { method: 'HEAD', properties: [] } },
            },
            {
              id: uuid(),
              name: 'global-settings:read',
              _links: {
                self: { href: withUuid('http://localhost/api/authority/{uuid}') },
                authorities: { href: 'http://localhost/api/authority' },
              },
              _templates: { default: { method: 'HEAD', properties: [] } },
            },
            {
              id: uuid(),
              name: 'global-settings:update',
              _links: {
                self: { href: withUuid('http://localhost/api/authority/{uuid}') },
                authorities: { href: 'http://localhost/api/authority' },
              },
              _templates: { default: { method: 'HEAD', properties: [] } },
            },
            {
              id: 'authorityId',
              name: 'pact:test:read',
              _links: {
                self: { href: 'http://localhost/api/authority/authorityId' },
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
          totalElements: 28,
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
      path: '/api/authority/authorityId',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['authority:read'] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: {
        [HttpHeaders.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        id: 'authorityId',
        name: 'pact:test:read',
        _links: {
          self: { href: 'http://localhost/api/authority/authorityId' },
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
      path: '/api/authority/authorityId',
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
        title: 'Identifier notFoundId was not found',
      },
    },
  };
}
