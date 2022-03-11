import { HttpHeaderKey } from '@app/domain';
import { ContentTypeEnum } from '@hal-form-client';
import { InteractionObject } from '@pact-foundation/pact';
import { HTTPMethod } from '@pact-foundation/pact/src/common/request';
import { eachLike, string, uuid } from '@pact-foundation/pact/src/dsl/matchers';
import { bearer, withUuid } from '../../utils/pact.utils';
import { jwtToken } from '../../utils/token.util';

const pactRole = {
  id: 'pactRoleId',
  name: 'PACT_ROLE',
  authorities: [
    { id: uuid(), name: 'pact:update' },
    { id: uuid(), name: 'pact:delete' },
    { id: uuid(), name: 'pact:read' },
  ],
  coreRole: false,
  canLogin: true,
  _links: {
    self: {
      href: 'http://localhost/api/role/pactRoleId',
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
};

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
            { ...pactRole },
            {
              id: uuid(),
              name: 'PACT_ROLE_2',
              authorities: eachLike({ id: uuid(), name: 'pact:update' }, { min: 1 }),
              coreRole: false,
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
              name: 'PACT_ROLE_3',
              authorities: eachLike({ id: uuid(), name: 'pact:update' }, { min: 1 }),
              coreRole: false,
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
          ],
        },
        _links: {
          self: {
            href: 'http://localhost/api/role?page=0&size=10',
          },
        },
        page: {
          size: 10,
          totalElements: 3,
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
          roleModels: eachLike({ id: string(), name: string() }, { min: 3 }),
        },
        _links: {
          self: {
            href: 'http://localhost/api/role?page=0&size=10',
          },
        },
        page: {
          size: 10,
          totalElements: 3,
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
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get one role',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/role/pactRoleId',
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
      body: { ...pactRole },
    },
  };

  export const with_update: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get one role with update',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/role/pactRoleId',
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
        ...pactRole,
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
      path: '/api/role/pactRoleId',
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
        ...pactRole,
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
        title: 'Role with id: notFoundId not found',
      },
    },
  };

  export const unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get one role unauthorized',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/role/pactRoleId',
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

export namespace CreateRolePact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'create role',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/role',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['role:create'] })),
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON,
      },
      body: {
        name: 'NEW_PACT_ROLE',
      },
    },
    willRespondWith: {
      status: 200,
      headers: {
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        id: 'newPactRoleId',
        name: 'NEW_PACT_ROLE',
        authorities: eachLike({ id: uuid(), name: 'pact:read' }, { min: 1 }),
        coreRole: false,
        canLogin: true,
        _links: {
          self: {
            href: 'http://localhost/api/role/newPactRoleId',
          },
          roles: {
            href: 'http://localhost/api/role{?search}',
            templated: true,
          },
        },
        _templates: { default: { method: 'HEAD', properties: [] } },
      },
    },
  };

  export const existing: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'create one role existing',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/role',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['role:create'] })),
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON,
      },
      body: {
        name: 'PACT_ROLE',
      },
    },
    willRespondWith: {
      status: 409,
      body: {
        reason: 'Conflict',
        title: 'Role with unique id: pactRole already exists',
      },
    },
  };

  export const unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'create role unauthorized',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/role',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken()),
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON,
      },
      body: {
        name: 'NEW_PACT_ROLE',
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

export namespace UpdateRolePact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'update role',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/role/pactRoleId',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['role:update'] })),
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON,
      },
      body: {
        name: 'PACT_ROLE',
      },
    },
    willRespondWith: {
      status: 200,
      headers: {
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
      },
      body: { ...pactRole },
    },
  };

  export const core_role: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'update role core role',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/role/coreRoleId',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['role:update'] })),
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON,
      },
      body: {
        name: 'PACT_ROLE',
      },
    },
    willRespondWith: {
      status: 403,
      body: {
        reason: 'Forbidden',
        title: 'Role coreRoleId is immutable',
      },
    },
  };

  export const unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'update role unauthorized',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/role/pactRoleId',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken()),
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON,
      },
      body: {
        name: 'PACT_ROLE',
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
    uponReceiving: 'update role not found',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/role/notFoundId',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['role:update'] })),
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON,
      },
      body: {
        name: 'PACT_ROLE',
      },
    },
    willRespondWith: {
      status: 404,
      body: {
        reason: 'Not Found',
        title: 'Role with id: notFoundId not found',
      },
    },
  };
}

export namespace DeleteRolePact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'delete role',
    withRequest: {
      method: HTTPMethod.DELETE,
      path: '/api/role/pactRoleId',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['role:delete'] })),
      },
    },
    willRespondWith: {
      status: 204,
    },
  };

  export const core_role: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'delete role core role',
    withRequest: {
      method: HTTPMethod.DELETE,
      path: '/api/role/coreRoleId',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['role:delete'] })),
      },
    },
    willRespondWith: {
      status: 403,
      body: {
        reason: 'Forbidden',
        title: 'Role coreRoleId is immutable',
      },
    },
  };

  export const unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'delete role unauthorized',
    withRequest: {
      method: HTTPMethod.DELETE,
      path: '/api/role/pactRoleId',
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
    uponReceiving: 'delete role not found',
    withRequest: {
      method: HTTPMethod.DELETE,
      path: '/api/role/notFoundId',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['role:delete'] })),
      },
    },
    willRespondWith: {
      status: 404,
      body: {
        reason: 'Not Found',
        title: 'Role with id: notFoundId not found',
      },
    },
  };
}
