import { HttpHeaderKey } from '@app/domain';
import { defaultTemplate } from '@app/domain/mocks';
import { ContentTypeEnum, IResource } from '@hal-form-client';
import { InteractionObject } from '@pact-foundation/pact';
import { HTTPMethod } from '@pact-foundation/pact/src/common/request';
import { uuid } from '@pact-foundation/pact/src/dsl/matchers';
import { bearer } from 'libs/consumer-pact/src/utils/pact.utils';
import { jwtToken } from 'libs/consumer-pact/src/utils/token.util';

const globalSettings: IResource = {
  signupOpen: true,
  defaultRole: {
    id: 'defaultPactRoleId',
    name: 'DEFAULT_PACT_ROLE',
    authorities: [
      { id: uuid(), name: 'pact:update' },
      { id: uuid(), name: 'pact:read' },
      { id: uuid(), name: 'pact:delete' },
    ],
    coreRole: false,
    canLogin: true,
  },
  _links: {
    self: { href: 'http://localhost/api/global-settings' },
  },
  _templates: { ...defaultTemplate },
};

export namespace GetGlobalSettingPact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get global settings',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/global-settings',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['global-settings:read'] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS },
      body: { ...globalSettings },
    },
  };

  export const with_update: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get global settings with update',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/global-settings',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['global-settings:read', 'global-settings:update'] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS },
      body: {
        ...globalSettings,
        _templates: {
          ...defaultTemplate,
          update: { method: 'PATCH', properties: [{ name: 'defaultRoleId', type: 'text' }, { name: 'signupOpen' }] },
        },
      },
    },
  };

  export const unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get global settings unauthorized',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/global-settings',
      headers: {
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
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

export namespace UpdateGlobalSettingPact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'update global settings',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/global-settings',
      headers: {
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON,
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['global-settings:update'] })),
      },
      body: {
        signupOpen: true,
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS },
      body: {
        ...globalSettings,
        _templates: {
          ...defaultTemplate,
          update: { method: 'PATCH', properties: [{ name: 'defaultRoleId', type: 'text' }, { name: 'signupOpen' }] },
        },
      },
    },
  };

  export const unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'update global settings unauthorized',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/global-settings',
      headers: {
        [HttpHeaderKey.CONTENT_TYPE]: ContentTypeEnum.APPLICATION_JSON,
        Accept: ContentTypeEnum.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken()),
      },
      body: {
        signupOpen: true,
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
