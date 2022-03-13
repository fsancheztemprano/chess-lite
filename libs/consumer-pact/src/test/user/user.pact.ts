import { HttpHeaderKey, UserManagementRelations } from '@app/domain';
import {
  createUserTemplate,
  defaultTemplate,
  deleteUserTemplate,
  requestActivationTokenTemplate,
  updateUserAuthoritiesTemplate,
  updateUserRoleTemplate,
  updateUserTemplate,
} from '@app/domain/mocks';
import { ContentTypeEnum } from '@hal-form-client';
import { InteractionObject } from '@pact-foundation/pact';
import { HTTPMethod } from '@pact-foundation/pact/src/common/request';
import {
  boolean,
  eachLike,
  email,
  iso8601DateTimeWithMillis,
  string,
  uuid,
} from '@pact-foundation/pact/src/dsl/matchers';
import { bearer, withUuid } from '../../utils/pact.utils';
import { jwtToken } from '../../utils/token.util';

const pactUser = {
  id: 'pactUserId',
  firstname: null,
  lastname: null,
  username: 'pactUser',
  email: 'pactUser@localhost',
  profileImageUrl: null,
  lastLoginDateDisplay: null,
  joinDate: iso8601DateTimeWithMillis(),
  role: {
    id: 'pactRoleId',
    name: 'PACT_ROLE',
    authorities: eachLike({ id: uuid(), name: string() }),
    coreRole: boolean(),
    canLogin: boolean(),
  },
  authorities: eachLike({ id: uuid(), name: string() }),
  active: true,
  locked: false,
  expired: false,
  credentialsExpired: false,
  userPreferences: {
    id: uuid(),
    darkMode: false,
    contentLanguage: 'en',
    _links: {
      [UserManagementRelations.USER_REL]: { href: 'http://localhost/api/user/pactUserId' },
      self: { href: withUuid('http://localhost/api/user/preferences/{uuid}') },
    },
    _templates: { ...defaultTemplate },
  },
  _links: {
    [UserManagementRelations.USERS_REL]: {
      href: 'http://localhost/api/user{?search}',
      templated: true,
    },
    [UserManagementRelations.USER_PREFERENCES_REL]: {
      href: withUuid('http://localhost/api/user/preferences/{uuid}'),
    },
    self: {
      href: 'http://localhost/api/user/pactUserId',
    },
  },
  _templates: { ...defaultTemplate },
};

export namespace GetUserPact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get one user',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/user/pactUserId',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['user:read'] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS },
      body: { ...pactUser },
    },
  };

  export const with_update: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get one user with update',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/user/pactUserId',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['user:read', 'user:update'] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS },
      body: {
        ...pactUser,
        _templates: {
          ...defaultTemplate,
          ...requestActivationTokenTemplate,
          ...updateUserTemplate,
        },
      },
    },
  };

  export const with_delete: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get one user with delete',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/user/pactUserId',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['user:read', 'user:delete'] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS },
      body: {
        ...pactUser,
        _templates: {
          ...defaultTemplate,
          ...deleteUserTemplate,
        },
      },
    },
  };

  export const with_update_role: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get one user with update role',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/user/pactUserId',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['user:read', 'user:update:role'] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS },
      body: {
        ...pactUser,
        _templates: {
          ...defaultTemplate,
          ...updateUserRoleTemplate,
        },
      },
    },
  };

  export const with_update_authorities: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get one user with update authorities',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/user/pactUserId',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['user:read', 'user:update:authorities'] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS },
      body: {
        ...pactUser,
        _templates: {
          ...defaultTemplate,
          ...updateUserAuthoritiesTemplate,
        },
      },
    },
  };

  export const unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get one user unauthorized',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/user/pactUserId',
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
    uponReceiving: 'get one user notfound',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/user/notFoundId',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['user:read'] })),
      },
    },
    willRespondWith: {
      status: 404,
      body: {
        reason: 'Not Found',
        title: 'User with id: notFoundId not found',
      },
    },
  };
}

export namespace GetAllUsersPact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get all users',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/user',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['user:read'] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS },
      body: {
        _embedded: {
          userModels: eachLike({ id: string(), username: string(), email: email() }, { min: 3 }),
        },
        _links: {
          self: {
            href: 'http://localhost/api/user?page=0&size=10',
          },
        },
        page: { size: 10, totalElements: 3, totalPages: 1, number: 0 },
        _templates: { ...defaultTemplate },
      },
    },
  };

  export const with_create: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get all users with create',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/user',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['user:read', 'user:create'] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS },
      body: {
        _embedded: {
          userModels: eachLike({ id: string(), username: string(), email: email() }, { min: 3 }),
        },
        _links: {
          self: {
            href: 'http://localhost/api/user?page=0&size=10',
          },
        },
        page: { size: 10, totalElements: 3, totalPages: 1, number: 0 },
        _templates: {
          ...defaultTemplate,
          ...createUserTemplate,
        },
      },
    },
  };

  export const unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get all users unauthorized',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/user',
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

export namespace CreateUserPact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'create user',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/user',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['user:read', 'user:create'] })),
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON,
      },
      body: {
        username: 'createdUser',
        email: 'createdUser@localhost',
        password: 'createdUser',
      },
    },
    willRespondWith: {
      status: 201,
      headers: {
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        [HttpHeaderKey.LOCATION]: withUuid('http://localhost/api/user/{uuid}'),
      },
      body: {
        ...pactUser,
        id: uuid(),
        email: 'createdUser@localhost',
        username: 'createdUser',
        userPreferences: {
          id: uuid(),
          darkMode: false,
          contentLanguage: 'en',
          _links: {
            [UserManagementRelations.USER_REL]: { href: withUuid('http://localhost/api/user/{uuid}') },
            self: { href: withUuid('http://localhost/api/user/preferences/{uuid}') },
          },
          _templates: { ...defaultTemplate },
        },
        _links: {
          ...pactUser._links,
          self: { href: withUuid('http://localhost/api/user/{uuid}') },
        },
      },
    },
  };

  export const existing: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'create user existing',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/user',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['user:create'] })),
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON,
      },
      body: {
        username: 'pactUser',
        email: 'pactUser@localhost',
        password: 'pactUser',
      },
    },
    willRespondWith: {
      status: 409,
      body: {
        reason: 'Conflict',
        title: 'User with unique id: pactUser already exists',
      },
    },
  };

  export const unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'create user unauthorized',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/user',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken()),
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON,
      },
      body: {
        username: 'createdUser',
        email: 'createdUser@localhost',
        password: 'createdUser',
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
