import { HttpHeaderKey } from '@app/ui/shared/domain';
import { defaultTemplate } from '@app/ui/testing';
import { ContentType, IResource } from '@hal-form-client';
import { InteractionObject } from '@pact-foundation/pact';
import { HTTPMethod } from '@pact-foundation/pact/src/common/request';
import { bearer } from '../../utils/pact.utils';
import { jwtToken } from '../../utils/token.utils';

const theme: IResource = {
  colors: {
    primary: '#85238f',
    accent: '#2c8588',
    warn: '#fa0000',
  },
  _links: {
    self: { href: 'http://localhost/api/theme' },
  },
  _templates: { ...defaultTemplate },
};

export const themeUpdateTemplate = {
  update: {
    method: 'PATCH',
    properties: [
      { name: 'primaryColor', type: 'text' },
      { name: 'accentColor', type: 'text' },
      { name: 'warnColor', type: 'text' },
    ],
  },
};

export namespace GetThemePact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get app theme',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/theme',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: { ...theme },
    },
  };

  export const with_update: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get theme with update template',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/theme',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['theme:update'] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: {
        ...theme,
        _templates: {
          ...defaultTemplate,
          ...themeUpdateTemplate,
        },
      },
    },
  };
}

export namespace UpdateThemePact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'update theme',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/theme',
      headers: {
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['theme:update'] })),
      },
      body: {
        primaryColor: '#3e58dc',
        accentColor: '#26881b',
        warnColor: '#6c0707',
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: {
        ...theme,
        colors: {
          primary: '#3e58dc',
          accent: '#26881b',
          warn: '#6c0707',
        },
        _templates: {
          ...defaultTemplate,
          ...themeUpdateTemplate,
        },
      },
    },
  };

  export const unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'update theme unauthorized',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/theme',
      headers: {
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken()),
      },
      body: {
        primaryColor: '#3e58dc',
        accentColor: '#26881b',
        warnColor: '#6c0707',
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
