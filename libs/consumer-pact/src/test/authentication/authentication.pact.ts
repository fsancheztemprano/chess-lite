import { ContentTypeEnum } from '@hal-form-client';
import { InteractionObject } from '@pact-foundation/pact';
import { HTTPMethod } from '@pact-foundation/pact/src/common/request';

export namespace Signup {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'new user signup',
    withRequest: {
      method: HTTPMethod.POST,
      path: '/api/auth/signup',
      headers: {
        'Content-Type': ContentTypeEnum.APPLICATION_JSON,
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        username: 'username1',
        email: 'username1@example.com',
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
        'Content-Type': ContentTypeEnum.APPLICATION_JSON,
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        username: 'username2',
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
        'Content-Type': ContentTypeEnum.APPLICATION_JSON,
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        username: 'username2',
        email: 'admin@example.com',
      },
    },
    willRespondWith: {
      status: 409,
      body: {
        reason: 'Conflict',
        title: 'Email already exists: admin@example.com',
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
        'Content-Type': ContentTypeEnum.APPLICATION_JSON,
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        email: 'username2@example.com',
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
        'Content-Type': ContentTypeEnum.APPLICATION_JSON,
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        username: 'admin',
        email: 'username2@example.com',
      },
    },
    willRespondWith: {
      status: 409,
      body: {
        reason: 'Conflict',
        title: 'Username already exists: admin',
      },
    },
  };
}
