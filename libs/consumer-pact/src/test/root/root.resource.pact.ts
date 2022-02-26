import { ContentTypeEnum } from '@hal-form-client';
import { InteractionObject } from '@pact-foundation/pact';
import { HTTPMethod } from '@pact-foundation/pact/src/common/request';
import { bearer } from 'libs/consumer-pact/src/utils/pact.utils';
import { jwtToken } from 'libs/consumer-pact/src/utils/token.util';

export namespace GetRootResourcePacts {
  export const getRootResourceAsUnauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get root resource as unauthorized user',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
      },
    },
    willRespondWith: {
      status: 200,
      headers: {
        'Content-Type': ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        _links: {
          self: {
            href: 'http://localhost/api',
          },
          login: {
            href: 'http://localhost/api/auth/login',
          },
          signup: {
            href: 'http://localhost/api/auth/signup',
          },
          'activation-token': {
            href: 'http://localhost/api/auth/token',
          },
          'activate-account': {
            href: 'http://localhost/api/auth/activate',
          },
        },
        _templates: {
          default: {
            method: 'HEAD',
            properties: [],
          },
          login: {
            method: 'POST',
            properties: [
              {
                name: 'password',
                required: true,
                minLength: 6,
                maxLength: 128,
                type: 'text',
              },
              {
                name: 'username',
                required: true,
                minLength: 5,
                maxLength: 128,
                type: 'text',
              },
            ],
            target: 'http://localhost/api/auth/login',
          },
          requestActivationToken: {
            method: 'POST',
            properties: [
              {
                name: 'email',
                required: true,
                type: 'email',
              },
            ],
            target: 'http://localhost/api/auth/token',
          },
          signup: {
            method: 'POST',
            properties: [
              {
                name: 'email',
                type: 'email',
              },
              {
                name: 'firstname',
                type: 'text',
              },
              {
                name: 'lastname',
                type: 'text',
              },
              {
                name: 'username',
                required: true,
                minLength: 5,
                maxLength: 128,
                type: 'text',
              },
            ],
            target: 'http://localhost/api/auth/signup',
          },
          activateAccount: {
            method: 'POST',
            properties: [
              {
                name: 'email',
                required: true,
                type: 'email',
              },
              {
                name: 'password',
                required: true,
                minLength: 8,
                maxLength: 128,
                type: 'text',
              },
              {
                name: 'token',
                required: true,
                minLength: 8,
                maxLength: 128,
                type: 'text',
              },
            ],
            target: 'http://localhost/api/auth/activate',
          },
        },
      },
    },
  };

  export const getRootResource_profile_read: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get root resource with authority profile:read',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['profile:read'] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: {
        'Content-Type': ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        _links: {
          self: {
            href: 'http://localhost/api',
          },
          'current-user': {
            href: 'http://localhost/api/user/profile',
          },
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

  export const getRootResource_admin_root: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get root resource with authority admin:root',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['admin:root'] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: {
        'Content-Type': ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
      },
      body: {
        _links: {
          self: {
            href: 'http://localhost/api',
          },
          administration: {
            href: 'http://localhost/api/administration',
          },
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
}
