import { HttpHeaderKey } from '@app/domain';
import { ContentTypeEnum } from '@hal-form-client';
import { InteractionObject } from '@pact-foundation/pact';
import { HTTPMethod } from '@pact-foundation/pact/src/common/request';
import { eachLike, like, string, uuid } from '@pact-foundation/pact/src/dsl/matchers';
import { bearer, withUuid } from '../../utils/pact.utils';
import { jwtToken } from '../../utils/token.util';

export namespace GetAllRolesPact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get all roles',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/role',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['role:read'] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: {
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        _embedded: {
          roleModels: [
            {
              id: uuid(),
              name: 'ADMIN_ROLE',
              authorities: [
                { id: uuid(), name: 'user:read' },
                { id: uuid(), name: 'service-logs:read' },
                { id: uuid(), name: 'user:create' },
                { id: uuid(), name: 'profile:delete' },
                { id: uuid(), name: 'service-logs:delete' },
                { id: uuid(), name: 'profile:update' },
                { id: uuid(), name: 'user:update' },
                { id: uuid(), name: 'profile:read' },
              ],
              coreRole: true,
              canLogin: false,
              _links: {
                self: {
                  href: withUuid('http://localhost/api/role/{uuid}'),
                },
                roles: {
                  href: 'http://localhost/api/role{?search}',
                  templated: true,
                },
              },
              _templates: {
                default: {
                  method: 'HEAD',
                  properties: [],
                },
              },
            },
            {
              id: 'defaultPactRoleId',
              name: 'DEFAULT_PACT_ROLE',
              authorities: [
                { id: uuid(), name: 'profile:delete' },
                { id: uuid(), name: 'profile:update' },
                { id: uuid(), name: 'profile:read' },
              ],
              coreRole: false,
              canLogin: true,
              _links: {
                self: {
                  href: 'http://localhost/api/role/defaultPactRoleId',
                },
                roles: {
                  href: 'http://localhost/api/role{?search}',
                  templated: true,
                },
              },
              _templates: {
                default: {
                  method: 'HEAD',
                  properties: [],
                },
              },
            },
            {
              id: uuid(),
              name: 'LOCKED_ROLE',
              authorities: like([]),
              coreRole: false,
              canLogin: false,
              _links: {
                self: {
                  href: withUuid('http://localhost/api/role/{uuid}'),
                },
                roles: {
                  href: 'http://localhost/api/role{?search}',
                  templated: true,
                },
              },
              _templates: {
                default: {
                  method: 'HEAD',
                  properties: [],
                },
              },
            },
            {
              id: uuid(),
              name: 'MOD_ROLE',
              authorities: [
                { id: uuid(), name: 'user:read' },
                { id: uuid(), name: 'profile:delete' },
                { id: uuid(), name: 'profile:update' },
                { id: uuid(), name: 'user:update' },
                { id: uuid(), name: 'profile:read' },
              ],
              coreRole: true,
              canLogin: false,
              _links: {
                self: {
                  href: withUuid('http://localhost/api/role/{uuid}'),
                },
                roles: {
                  href: 'http://localhost/api/role{?search}',
                  templated: true,
                },
              },
              _templates: {
                default: {
                  method: 'HEAD',
                  properties: [],
                },
              },
            },
            {
              id: uuid(),
              name: 'SUPER_ADMIN_ROLE',
              authorities: [
                { id: uuid(), name: 'admin:role-management:root' },
                { id: uuid(), name: 'admin:user-management:root' },
                { id: uuid(), name: 'user:delete' },
                { id: uuid(), name: 'role:read' },
                { id: uuid(), name: 'global-settings:update' },
                { id: uuid(), name: 'user:read' },
                { id: uuid(), name: 'service-logs:read' },
                { id: uuid(), name: 'authority:update' },
                { id: uuid(), name: 'profile:delete' },
                { id: uuid(), name: 'service-logs:delete' },
                { id: uuid(), name: 'profile:update' },
                { id: uuid(), name: 'role:update:core' },
                { id: uuid(), name: 'authority:create' },
                { id: uuid(), name: 'profile:read' },
                { id: uuid(), name: 'user:update:role' },
                { id: uuid(), name: 'role:update' },
                { id: uuid(), name: 'user:update:authorities' },
                { id: uuid(), name: 'user:preferences:update' },
                { id: uuid(), name: 'role:delete' },
                { id: uuid(), name: 'authority:delete' },
                { id: uuid(), name: 'user:create' },
                { id: uuid(), name: 'authority:read' },
                { id: uuid(), name: 'role:create' },
                { id: uuid(), name: 'global-settings:read' },
                { id: uuid(), name: 'user:update' },
                { id: uuid(), name: 'admin:root' },
                { id: uuid(), name: 'user:preferences:read' },
              ],
              coreRole: true,
              canLogin: true,
              _links: {
                self: {
                  href: withUuid('http://localhost/api/role/{uuid}'),
                },
                roles: {
                  href: 'http://localhost/api/role{?search}',
                  templated: true,
                },
              },
              _templates: {
                default: {
                  method: 'HEAD',
                  properties: [],
                },
              },
            },
            {
              id: uuid(),
              name: 'USER_ROLE',
              authorities: [
                { id: uuid(), name: 'profile:delete' },
                { id: uuid(), name: 'profile:update' },
                { id: uuid(), name: 'profile:read' },
              ],
              coreRole: true,
              canLogin: false,
              _links: {
                self: {
                  href: withUuid('http://localhost/api/role/{uuid}'),
                },
                roles: {
                  href: 'http://localhost/api/role{?search}',
                  templated: true,
                },
              },
              _templates: {
                default: {
                  method: 'HEAD',
                  properties: [],
                },
              },
            },
          ],
        },
        _links: {
          self: {
            href: 'http://localhost/api/role?page=0&size=10&sort=name,asc',
          },
        },
        page: {
          size: 10,
          totalElements: 6,
          totalPages: 1,
          number: 0,
        },
        _templates: {
          default: {
            method: 'HEAD',
            properties: [],
          },
        },
      },
    },
  };

  export const with_create: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get create role template',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/role',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['role:read', 'role:create'] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: {
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        _embedded: {
          roleModels: eachLike({ id: string(), name: string() }, { min: 5 }),
        },
        _links: {
          self: {
            href: 'http://localhost/api/role?page=0&size=10&sort=name,asc',
          },
        },
        page: {
          size: 10,
          totalElements: 6,
          totalPages: 1,
          number: 0,
        },
        _templates: {
          default: {
            method: 'HEAD',
            properties: [],
          },
          create: {
            method: 'POST',
            properties: [
              {
                name: 'name',
                required: true,
                minLength: 3,
                maxLength: 128,
                type: 'text',
              },
            ],
            target: 'http://localhost/api/role',
          },
        },
      },
    },
  };

  export const unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get all roles unauthorized',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/role',
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

export namespace GetOneRolePact {
  const expectedRole = {
    id: 'defaultPactRoleId',
    name: 'DEFAULT_PACT_ROLE',
    authorities: eachLike({ id: uuid(), name: 'profile:delete' }, { min: 3 }),
    coreRole: false,
    canLogin: true,
    _links: {
      self: {
        href: 'http://localhost/api/role/defaultPactRoleId',
      },
      roles: {
        href: 'http://localhost/api/role{?search}',
        templated: true,
      },
    },
    _templates: { default: { method: 'HEAD', properties: [] } },
  };

  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get one role',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/role/defaultPactRoleId',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['role:read'] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: {
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
      },
      body: { ...expectedRole },
    },
  };

  export const with_update: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get one role with update',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/role/defaultPactRoleId',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['role:read', 'role:update'] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: {
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        ...expectedRole,
        _templates: {
          default: { method: 'HEAD', properties: [] },
          update: {
            method: 'PATCH',
            properties: [
              {
                name: 'authorityIds',
              },
              {
                name: 'canLogin',
              },
              {
                name: 'name',
                minLength: 3,
                maxLength: 128,
                type: 'text',
              },
            ],
          },
        },
      },
    },
  };

  export const with_delete: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get one role with delete',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/role/defaultPactRoleId',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['role:read', 'role:delete'] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: {
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        ...expectedRole,
        _templates: {
          default: { method: 'HEAD', properties: [] },
          delete: {
            method: 'DELETE',
            properties: [],
          },
        },
      },
    },
  };

  export const not_found: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get one role not found',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/role/notFoundId',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['role:read'] })),
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

  export const unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get one role unauthorized',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/role/defaultPactRoleId',
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
