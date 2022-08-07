import { CurrentUserRelations, HttpHeaderKey, UserAuthority, UserManagementRelations } from '@app/ui/shared/domain';
import {
  createUserTemplate,
  defaultTemplate,
  deleteUserTemplate,
  jwtToken,
  requestActivationTokenTemplate,
  updateUserAuthoritiesTemplate,
  updateUserRoleTemplate,
  updateUserTemplate,
} from '@app/ui/testing';
import { ContentType } from '@hal-form-client';
import { InteractionObject } from '@pact-foundation/pact';
import { HTTPMethod } from '@pact-foundation/pact/src/common/request';
import { eachLike, email, string, uuid } from '@pact-foundation/pact/src/dsl/matchers';
import { pactUser } from '../../mocks/user.mock';
import { bearer, withUuid } from '../../utils/pact.utils';

export namespace GetUserPact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get one user',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/user/pactUserId',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: [UserAuthority.USER_READ] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
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
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: [UserAuthority.USER_READ, UserAuthority.USER_UPDATE] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
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
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: [UserAuthority.USER_READ, UserAuthority.USER_DELETE] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
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
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: [UserAuthority.USER_READ, UserAuthority.USER_UPDATE_ROLE] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
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
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(
          jwtToken({ authorities: [UserAuthority.USER_READ, UserAuthority.USER_UPDATE_AUTHORITIES] }),
        ),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
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

  export const not_found: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get one user notfound',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/user/notFoundId',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: [UserAuthority.USER_READ] })),
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
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: [UserAuthority.USER_READ] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: {
        _embedded: {
          userModels: eachLike({ id: string(), username: string(), email: email() }, { min: 3 }),
        },
        _links: {
          self: { href: 'http://localhost/api/user?page=0&size=10' },
          ws: { href: '/ami/user' },
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
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: [UserAuthority.USER_READ, UserAuthority.USER_CREATE] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
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

export namespace CreateUserPact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'create user',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/user',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: [UserAuthority.USER_READ, UserAuthority.USER_CREATE] })),
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
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
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS,
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
          [CurrentUserRelations.USER_PREFERENCES_REL]: {
            href: withUuid('http://localhost/api/user/preferences/{uuid}'),
          },
          ws: { href: withUuid('/ami/user/{uuid}') },
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
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: [UserAuthority.USER_CREATE] })),
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
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
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken()),
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
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

export namespace UpdateUserPact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'update one user',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/user/pactUserId',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: [UserAuthority.USER_READ, UserAuthority.USER_UPDATE] })),
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
      },
      body: {
        firstname: 'pactUserFirstname',
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: {
        ...pactUser,
      },
    },
  };

  export const not_found: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'update one user not found',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/user/notFoundId',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: [UserAuthority.USER_READ, UserAuthority.USER_UPDATE] })),
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
      },
      body: {
        firstname: 'notFoundFirstname',
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

  export const unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'update one user unauthorized',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/user/pactUserId',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken()),
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
      },
      body: {
        firstname: 'pactUserFirstname',
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

  export const existing: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'update one user existing',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/user/pactUserId',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: [UserAuthority.USER_READ, UserAuthority.USER_UPDATE] })),
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
      },
      body: {
        email: 'existingUser@localhost',
      },
    },
    willRespondWith: {
      status: 409,
      body: {
        reason: 'Conflict',
        title: 'User with unique id: existingUser@localhost already exists',
      },
    },
  };
}

export namespace UpdateUserRolePact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'update user role',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/user/pactUserId/role',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: [UserAuthority.USER_READ, UserAuthority.USER_UPDATE_ROLE] })),
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
      },
      body: {
        roleId: 'pactRoleId',
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: {
        ...pactUser,
      },
    },
  };

  export const user_not_found: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'update user role, user not found',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/user/notFoundId/role',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: [UserAuthority.USER_READ, UserAuthority.USER_UPDATE_ROLE] })),
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
      },
      body: {
        roleId: 'pactRoleId',
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

  export const role_not_found: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'update user role, role not found',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/user/pactUserId/role',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: [UserAuthority.USER_READ, UserAuthority.USER_UPDATE_ROLE] })),
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
      },
      body: {
        roleId: 'notFoundId',
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
    uponReceiving: 'update user role, unauthorized',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/user/pactUserId/role',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken()),
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
      },
      body: {
        roleId: 'pactRoleId',
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

export namespace UpdateUserAuthoritiesPact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'update user authorities',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/user/pactUserId/authorities',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(
          jwtToken({ authorities: [UserAuthority.USER_READ, UserAuthority.USER_UPDATE_AUTHORITIES] }),
        ),
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
      },
      body: {
        authorityIds: ['pactAuthorityId'],
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: {
        ...pactUser,
      },
    },
  };

  export const user_not_found: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'update user authorities, user not found',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/user/notFoundId/authorities',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(
          jwtToken({ authorities: [UserAuthority.USER_READ, UserAuthority.USER_UPDATE_AUTHORITIES] }),
        ),
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
      },
      body: {
        authorityIds: ['pactAuthorityId'],
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

  export const unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'update user authorities, unauthorized',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/user/pactUserId/authorities',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken()),
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
      },
      body: {
        authorityIds: ['pactAuthorityId'],
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

export namespace DeleteUserPact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'delete one user',
    withRequest: {
      method: HTTPMethod.DELETE,
      path: '/api/user/pactUserId',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: [UserAuthority.USER_READ, UserAuthority.USER_DELETE] })),
      },
    },
    willRespondWith: {
      status: 204,
    },
  };

  export const not_found: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'delete one user not found',
    withRequest: {
      method: HTTPMethod.DELETE,
      path: '/api/user/notFoundId',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: [UserAuthority.USER_READ, UserAuthority.USER_DELETE] })),
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

  export const unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'delete one user unauthorized',
    withRequest: {
      method: HTTPMethod.DELETE,
      path: '/api/user/pactUserId',
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

export namespace RequestActivationTokenPact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'request activation token',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/user/pactUserId',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: [UserAuthority.USER_UPDATE] })),
      },
    },
    willRespondWith: {
      status: 204,
    },
  };

  export const not_found: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'request activation token user not found',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/user/notFoundId',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: [UserAuthority.USER_UPDATE] })),
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

  export const unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'request activation token unauthorized',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/user/pactUserId',
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
