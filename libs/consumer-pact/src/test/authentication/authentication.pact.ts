import { HttpHeaderKey } from '@app/domain';
import { ContentTypeEnum } from '@hal-form-client';
import { InteractionObject } from '@pact-foundation/pact';
import { HTTPMethod } from '@pact-foundation/pact/src/common/request';
import { iso8601DateTimeWithMillis, uuid } from '@pact-foundation/pact/src/dsl/matchers';
import { jwt } from 'libs/consumer-pact/src/utils/pact.utils';
import { jwtToken } from 'libs/consumer-pact/src/utils/token.util';

export namespace SignupPact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'new user signup',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/auth/signup',
      headers: {
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON,
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        username: 'janeDoe',
        email: 'janeDoe@localhost',
      },
    },
    willRespondWith: {
      status: 204,
    },
  };

  export const no_email: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'new user signup without email',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/auth/signup',
      headers: {
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON,
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        username: 'username1',
      },
    },
    willRespondWith: {
      status: 400,
      body: {
        reason: 'Bad Request',
        title: 'An error has occurred',
      },
    },
  };

  export const existing_email: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'new user signup with existing email',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/auth/signup',
      headers: {
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON,
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        username: 'username2',
        email: 'pactUser@localhost',
      },
    },
    willRespondWith: {
      status: 409,
      body: {
        reason: 'Conflict',
        title: 'User with unique id: pactUser@localhost already exists',
      },
    },
  };

  export const no_username: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'new user signup without username',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/auth/signup',
      headers: {
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON,
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        email: 'username3@localhost',
      },
    },
    willRespondWith: {
      status: 400,
      body: {
        reason: 'Bad Request',
        title: 'An error has occurred',
      },
    },
  };

  export const existing_username: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'new user signup with existing username',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/auth/signup',
      headers: {
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON,
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        username: 'pactUser',
        email: 'username4@localhost',
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
}

export namespace LoginPact {
  export const locked_role: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'locked role login',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/auth/login',
      headers: {
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON,
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        username: 'lockedRoleUser',
        password: 'lockedRoleUser',
      },
    },
    willRespondWith: {
      status: 401,
      body: {
        reason: 'Unauthorized',
        title: 'LOCKED_ROLE is locked',
      },
    },
  };

  export const locked_user: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'locked user login',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/auth/login',
      headers: {
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON,
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        username: 'lockedUser',
        password: 'lockedUser',
      },
    },
    willRespondWith: {
      status: 401,
      body: {
        reason: 'Unauthorized',
        title: 'User account is locked',
      },
    },
  };

  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'successful login',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/auth/login',
      headers: {
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON,
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        username: 'pactUser',
        password: 'pactUser0',
      },
    },
    willRespondWith: {
      status: 200,
      headers: {
        [HttpHeaderKey.ACCESS_CONTROL_EXPOSE_HEADERS]: HttpHeaderKey.JWT_TOKEN,
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        [HttpHeaderKey.JWT_TOKEN]: jwt(jwtToken()),
      },
      body: {
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
          authorities: [
            { id: uuid(), name: 'profile:read' },
            { id: uuid(), name: 'profile:update' },
            { id: uuid(), name: 'profile:delete' },
          ],
          coreRole: false,
          canLogin: true,
        },
        authorities: [
          { id: uuid(), name: 'profile:read' },
          { id: uuid(), name: 'profile:update' },
          { id: uuid(), name: 'profile:delete' },
        ],
        active: true,
        locked: false,
        expired: false,
        credentialsExpired: false,
        userPreferences: {
          id: 'pactUserPreferencesId',
          darkMode: false,
          contentLanguage: 'en',
          user: { id: 'pactUserId', username: 'pactUser' },
          _links: {
            'current-user': { href: 'http://localhost/api/user/profile' },
            self: { href: 'http://localhost/api/user/profile/preferences' },
          },
          _templates: {
            default: { method: 'HEAD', properties: [] },
            updatePreferences: {
              method: 'PATCH',
              properties: [{ name: 'contentLanguage', minLength: 2, maxLength: 2, type: 'text' }, { name: 'darkMode' }],
            },
          },
        },
        _links: {
          'user-preferences': { href: 'http://localhost/api/user/profile/preferences' },
          self: { href: 'http://localhost/api/user/profile' },
        },
        _templates: {
          default: { method: 'HEAD', properties: [] },
          updateProfile: {
            method: 'PATCH',
            properties: [
              { name: 'firstname', type: 'text' },
              { name: 'lastname', type: 'text' },
            ],
          },
          uploadAvatar: {
            method: 'PATCH',
            contentType: 'multipart/form-data',
            properties: [],
            target: 'http://localhost/api/user/profile/avatar',
          },
          deleteProfile: { method: 'DELETE', properties: [] },
          changePassword: {
            method: 'PATCH',
            properties: [
              { name: 'newPassword', minLength: 8, maxLength: 128, type: 'text' },
              { name: 'password', minLength: 8, maxLength: 128, type: 'text' },
            ],
            target: 'http://localhost/api/user/profile/password',
          },
        },
      },
    },
  };
}

export namespace ActivationTokenPact {
  export const not_found: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'request activation token with email not found',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/auth/token',
      headers: {
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON,
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        email: 'notFound@localhost',
      },
    },
    willRespondWith: {
      status: 404,
      body: {
        reason: 'Not Found',
        title: 'User with id: notFound@localhost not found',
      },
    },
  };

  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'request activation token',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/auth/token',
      headers: {
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON,
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        email: 'lockedRoleUser@localhost',
      },
    },
    willRespondWith: {
      status: 204,
    },
  };
}

export namespace ActivateAccountPact {
  export const not_found: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'activate account not found',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/auth/activate',
      headers: {
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON,
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        password: 'notFoundPassword',
        token: 'notFoundTokenId',
        email: 'notFound@localhost',
      },
    },
    willRespondWith: {
      status: 404,
      body: {
        reason: 'Not Found',
        title: 'User with id: notFound@localhost not found',
      },
    },
  };

  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'activate account',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/auth/activate',
      headers: {
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON,
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        password: 'activationUser',
        token: 'activationUserTokenId',
        email: 'activationUser@localhost',
      },
    },
    willRespondWith: {
      status: 204,
    },
  };
}
