import { CurrentUserRelations, HttpHeaderKey } from '@app/domain';
import { defaultTemplate } from '@app/domain/mocks';
import { ContentTypeEnum } from '@hal-form-client';
import { InteractionObject } from '@pact-foundation/pact';
import { HTTPMethod } from '@pact-foundation/pact/src/common/request';
import { boolean, eachLike, iso8601DateTimeWithMillis, string, uuid } from '@pact-foundation/pact/src/dsl/matchers';
import {
  changePasswordTemplate,
  deleteProfileTemplate,
  updateProfilePreferencesTemplate,
  updateProfileTemplate,
  uploadAvatarTemplate,
} from '../../../../domain/src/lib/mocks/user/user-profile.mock';
import { bearer } from '../../utils/pact.utils';
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
    user: {
      id: 'pactUserId',
      username: 'pactUser',
    },
    _links: {
      [CurrentUserRelations.CURRENT_USER_REL]: {
        href: 'http://localhost/api/user/profile',
      },
      self: {
        href: 'http://localhost/api/user/profile/preferences',
      },
    },
    _templates: { ...defaultTemplate },
  },
  _links: {
    [CurrentUserRelations.USER_PREFERENCES_REL]: {
      href: 'http://localhost/api/user/profile/preferences',
    },
    self: {
      href: 'http://localhost/api/user/profile',
    },
  },
  _templates: { ...defaultTemplate },
};

export namespace GetUserProfilePact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get user profile',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/user/profile',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ user: { id: pactUser.id }, authorities: ['profile:read'] })),
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
    uponReceiving: 'get user profile with update',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/user/profile',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ user: { id: pactUser.id }, authorities: ['profile:read', 'profile:update'] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS },
      body: {
        ...pactUser,
        userPreferences: {
          ...pactUser.userPreferences,
          _templates: {
            ...defaultTemplate,
            ...updateProfilePreferencesTemplate,
          },
        },
        _templates: {
          ...defaultTemplate,
          ...updateProfileTemplate,
          ...uploadAvatarTemplate,
          ...changePasswordTemplate,
        },
      },
    },
  };

  export const with_delete: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get user profile with delete',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/user/profile',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ user: { id: pactUser.id }, authorities: ['profile:read', 'profile:delete'] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS },
      body: {
        ...pactUser,
        _templates: {
          ...defaultTemplate,
          ...deleteProfileTemplate,
        },
      },
    },
  };

  export const unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get user profile unauthorized',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/user/profile',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ user: { id: pactUser.id } })),
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
    uponReceiving: 'get user profile not found',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/user/profile',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ user: { id: 'notFoundId' }, authorities: ['profile:read'] })),
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

export namespace UpdateUserProfilePact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'update user profile',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/user/profile',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(
          jwtToken({
            user: { id: pactUser.id },
            authorities: ['profile:read', 'profile:update'],
          }),
        ),
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON,
      },
      body: { firstname: 'pactUserFirstname' },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS },
      body: { ...pactUser },
    },
  };

  export const unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'update user profile unauthorized',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/user/profile',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ user: { id: pactUser.id } })),
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON,
      },
      body: { firstname: 'pactUserFirstname' },
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
    uponReceiving: 'update user profile not found',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/user/profile',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(
          jwtToken({
            user: { id: 'notFoundId' },
            authorities: ['profile:read', 'profile:update'],
          }),
        ),
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON,
      },
      body: { firstname: 'pactUserFirstname' },
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

export namespace ChangeUserProfilePasswordPact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'change user profile password',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/user/profile/password',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(
          jwtToken({
            user: { id: pactUser.id },
            authorities: ['profile:read', 'profile:update'],
          }),
        ),
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON,
      },
      body: { password: 'password', newPassword: 'newPassword' },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS },
      body: { ...pactUser },
    },
  };

  export const unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'change user profile password unauthorized',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/user/profile/password',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ user: { id: pactUser.id } })),
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON,
      },
      body: { password: 'password', newPassword: 'newPassword' },
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
    uponReceiving: 'change user profile password not found',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/user/profile/password',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(
          jwtToken({
            user: { id: 'notFoundId' },
            authorities: ['profile:read', 'profile:update'],
          }),
        ),
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON,
      },
      body: { password: 'password', newPassword: 'newPassword' },
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
