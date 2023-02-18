import { AdminAuthority, HttpHeaderKey, ProfileAuthority, TokenAuthority } from '@app/ui/shared/domain';
import { defaultTemplate } from '@app/ui/testing';
import { ContentType } from '@hal-form-client';
import { InteractionObject } from '@pact-foundation/pact';
import { HTTPMethods } from '@pact-foundation/pact/src/common/request';
import { bearer } from '../../utils/pact.utils';
import { jwtToken } from '../../utils/token.utils';

export namespace GetRootResource {
  export const unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get root resource as unauthorized user',
    withRequest: {
      method: HTTPMethods.GET,
      path: '/api',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: {
        _links: {
          self: { href: 'http://localhost/api' },
          login: { href: 'http://localhost/api/auth/login' },
          signup: { href: 'http://localhost/api/auth/signup' },
          'activation-token': { href: 'http://localhost/api/auth/token' },
          'activate-account': { href: 'http://localhost/api/auth/activate' },
          'build-info': { href: 'http://localhost/api/build-info' },
          theme: { href: 'http://localhost/api/theme' },
        },
        _templates: {
          ...defaultTemplate,
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
              { name: 'email', type: 'email' },
              { name: 'firstname', type: 'text' },
              { name: 'lastname', type: 'text' },
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
              { name: 'email', required: true, type: 'email' },
              {
                name: 'password',
                required: true,
                minLength: 8,
                maxLength: 128,
                type: 'text',
              },
              { name: 'token', required: true, minLength: 8, maxLength: 128, type: 'text' },
            ],
            target: 'http://localhost/api/auth/activate',
          },
        },
      },
    },
  };

  export const authorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get root resource as authorized',
    withRequest: {
      method: HTTPMethods.GET,
      path: '/api',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken()),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: {
        _links: {
          self: { href: 'http://localhost/api' },
          'build-info': { href: 'http://localhost/api/build-info' },
          theme: { href: 'http://localhost/api/theme' },
        },
        _templates: { ...defaultTemplate },
      },
    },
  };

  export const with_token_refresh: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get root resource with authority token:refresh',
    withRequest: {
      method: HTTPMethods.GET,
      path: '/api',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: [TokenAuthority.TOKEN_REFRESH] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: {
        _links: {
          self: { href: 'http://localhost/api' },
          token: { href: 'http://localhost/api/auth/token' },
          'build-info': { href: 'http://localhost/api/build-info' },
          theme: { href: 'http://localhost/api/theme' },
        },
        _templates: { ...defaultTemplate },
      },
    },
  };

  export const with_profile_read: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get root resource with authority profile:read',
    withRequest: {
      method: HTTPMethods.GET,
      path: '/api',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: [ProfileAuthority.PROFILE_READ] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: {
        _links: {
          self: { href: 'http://localhost/api' },
          'current-user': { href: 'http://localhost/api/user/profile' },
          'build-info': { href: 'http://localhost/api/build-info' },
          theme: { href: 'http://localhost/api/theme' },
        },
        _templates: { ...defaultTemplate },
      },
    },
  };

  export const with_admin_root: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get root resource with authority admin:root',
    withRequest: {
      method: HTTPMethods.GET,
      path: '/api',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: [AdminAuthority.ADMIN_ROOT] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: {
        _links: {
          self: { href: 'http://localhost/api' },
          administration: { href: 'http://localhost/api/administration' },
          'build-info': { href: 'http://localhost/api/build-info' },
          theme: { href: 'http://localhost/api/theme' },
        },
        _templates: { ...defaultTemplate },
      },
    },
  };
}
