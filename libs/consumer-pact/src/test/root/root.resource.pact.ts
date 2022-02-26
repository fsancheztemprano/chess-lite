import { ContentTypeEnum } from '@hal-form-client';
import { InteractionObject } from '@pact-foundation/pact';
import { HTTPMethod } from '@pact-foundation/pact/src/common/request';

export namespace GetRootResourcePacts {
  export const getRootResource: InteractionObject = {
    state: 'no token',
    uponReceiving: 'get root resource',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
      },
    },
    willRespondWith: {
      status: 200,
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
}
