import { HttpHeaderKey, TokenAuthority } from '@app/ui/shared/domain';
import {
  changePasswordTemplate,
  defaultTemplate,
  updateProfilePreferencesTemplate,
  updateProfileTemplate,
  uploadAvatarTemplate,
} from '@app/ui/testing';
import { ContentType } from '@hal-form-client';
import { Interaction, InteractionObject } from '@pact-foundation/pact';
import { HTTPMethods } from '@pact-foundation/pact/src/common/request';
import { pactCurrentUser } from '../../mocks/user.mock';
import { bearer, jwt } from '../../utils/pact.utils';
import { jwtToken } from '../../utils/token.utils';

export namespace SignupPact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'new user signup',
    withRequest: {
      method: HTTPMethods.POST,
      path: '/api/auth/signup',
      headers: {
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
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
      method: HTTPMethods.POST,
      path: '/api/auth/signup',
      headers: {
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        username: 'username1',
      },
    },
    willRespondWith: {
      status: 400,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
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
      method: HTTPMethods.POST,
      path: '/api/auth/signup',
      headers: {
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        username: 'username2',
        email: 'pactUser@localhost',
      },
    },
    willRespondWith: {
      status: 409,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
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
      method: HTTPMethods.POST,
      path: '/api/auth/signup',
      headers: {
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        email: 'username3@localhost',
      },
    },
    willRespondWith: {
      status: 400,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
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
      method: HTTPMethods.POST,
      path: '/api/auth/signup',
      headers: {
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        username: 'pactUser',
        email: 'username4@localhost',
      },
    },
    willRespondWith: {
      status: 409,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
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
      method: HTTPMethods.POST,
      path: '/api/auth/login',
      headers: {
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        username: 'lockedRoleUser',
        password: 'lockedRoleUser',
      },
    },
    willRespondWith: {
      status: 401,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
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
      method: HTTPMethods.POST,
      path: '/api/auth/login',
      headers: {
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        username: 'lockedUser',
        password: 'lockedUser',
      },
    },
    willRespondWith: {
      status: 401,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
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
      method: HTTPMethods.POST,
      path: '/api/auth/login',
      headers: {
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        username: 'pactUser',
        password: 'pactUser0',
      },
    },
    willRespondWith: {
      status: 200,
      headers: {
        [HttpHeaderKey.ACCESS_CONTROL_EXPOSE_HEADERS]: `${HttpHeaderKey.JWT_TOKEN}, ${HttpHeaderKey.JWT_REFRESH_TOKEN}`,
        [HttpHeaderKey.JWT_TOKEN]: jwt(jwtToken()),
        [HttpHeaderKey.JWT_REFRESH_TOKEN]: jwt(jwtToken()),
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        ...pactCurrentUser,
        userPreferences: {
          ...pactCurrentUser.userPreferences,
          _templates: {
            ...defaultTemplate,
            ...(updateProfilePreferencesTemplate as Record<string, unknown>),
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
}

export namespace RefreshTokenPact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'refresh token successful',
    withRequest: {
      method: HTTPMethods.GET,
      path: '/api/auth/token',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(
          jwtToken({
            user: { id: pactCurrentUser.id },
            authorities: [TokenAuthority.TOKEN_REFRESH],
          }),
        ),
      },
    },
    willRespondWith: {
      status: 200,
      headers: {
        [HttpHeaderKey.ACCESS_CONTROL_EXPOSE_HEADERS]: `${HttpHeaderKey.JWT_TOKEN}, ${HttpHeaderKey.JWT_REFRESH_TOKEN}`,
        [HttpHeaderKey.JWT_TOKEN]: jwt(jwtToken()),
        [HttpHeaderKey.JWT_REFRESH_TOKEN]: jwt(jwtToken()),
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS,
      },
      body: { ...pactCurrentUser },
    },
  };

  export const locked_role: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'refresh token locked role',
    withRequest: {
      method: HTTPMethods.GET,
      path: '/api/auth/token',
      headers: {
        Authorization: bearer(
          jwtToken({
            user: { id: 'lockedRoleUserId' },
            authorities: [TokenAuthority.TOKEN_REFRESH],
          }),
        ),
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
      },
    },
    willRespondWith: {
      status: 401,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: {
        reason: 'Unauthorized',
        title: 'LOCKED_ROLE is locked',
      },
    },
  };

  export const locked_user: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'refresh token locked user',
    withRequest: {
      method: HTTPMethods.GET,
      path: '/api/auth/token',
      headers: {
        Authorization: bearer(jwtToken({ user: { id: 'lockedUserId' }, authorities: [TokenAuthority.TOKEN_REFRESH] })),
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
      },
    },
    willRespondWith: {
      status: 401,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: {
        reason: 'Unauthorized',
        title: 'User account is locked',
      },
    },
  };

  export const unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'refresh token unauthorized',
    withRequest: {
      method: HTTPMethods.GET,
      path: '/api/auth/token',
      headers: {
        Authorization: bearer(jwtToken({ user: { id: pactCurrentUser.id } })),
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
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
    uponReceiving: 'refresh token user not found',
    withRequest: {
      method: HTTPMethods.GET,
      path: '/api/auth/token',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ user: { id: 'notFoundId' }, authorities: [TokenAuthority.TOKEN_REFRESH] })),
      },
    },
    willRespondWith: {
      status: 404,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: {
        reason: 'Not Found',
        title: 'User with id: notFoundId not found',
      },
    },
  };
}

export namespace ActivationTokenPact {
  export const not_found = new Interaction()
    .given('stateless')
    .uponReceiving('request activation token with email not found')
    .withRequest({
      method: HTTPMethods.POST,
      path: '/api/auth/token',
      headers: {
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        email: 'notFound@localhost',
      },
    })
    .willRespondWith({
      status: 404,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: {
        reason: 'Not Found',
        title: 'User with id: notFound@localhost not found',
      },
    });

  export const successful: Interaction = new Interaction()
    .given('stateless')
    .uponReceiving('request activation token')
    .withRequest({
      method: HTTPMethods.POST,
      path: '/api/auth/token',
      headers: {
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        email: 'lockedRoleUser@localhost',
      },
    })
    .willRespondWith({
      status: 204,
    });
}

export namespace ActivateAccountPact {
  export const not_found: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'activate account not found',
    withRequest: {
      method: HTTPMethods.POST,
      path: '/api/auth/activate',
      headers: {
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        password: 'notFoundPassword',
        token: 'notFoundTokenId',
        email: 'notFound@localhost',
      },
    },
    willRespondWith: {
      status: 404,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
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
      method: HTTPMethods.POST,
      path: '/api/auth/activate',
      headers: {
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
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
