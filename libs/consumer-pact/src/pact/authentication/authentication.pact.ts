import { HttpHeaderKey } from '@app/domain';
import { defaultTemplate } from '@app/domain/mocks';
import { ContentTypeEnum } from '@hal-form-client';
import { InteractionObject } from '@pact-foundation/pact';
import { HTTPMethod } from '@pact-foundation/pact/src/common/request';
import { jwt } from 'libs/consumer-pact/src/utils/pact.utils';
import { jwtToken } from 'libs/consumer-pact/src/utils/token.util';
import {
  changePasswordTemplate,
  updateProfilePreferencesTemplate,
  updateProfileTemplate,
  uploadAvatarTemplate,
} from '../../../../domain/src/lib/mocks/user/user-profile-template.mock';
import { pactCurrentUser } from '../../mocks/user.mock';

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
        ...pactCurrentUser,
        userPreferences: {
          ...pactCurrentUser.userPreferences,
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
