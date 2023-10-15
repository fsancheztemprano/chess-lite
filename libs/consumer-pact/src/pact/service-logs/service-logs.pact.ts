import { HttpHeaderKey } from '@app/ui/shared/domain';
import { defaultTemplate } from '@app/ui/testing';
import { ContentType } from '@hal-form-client';
import { InteractionObject } from '@pact-foundation/pact';
import { HTTPMethods } from '@pact-foundation/pact/src/common/request';
import { iso8601DateTimeWithMillis, string } from '@pact-foundation/pact/src/dsl/matchers';
import { bearer } from '../../utils/pact.utils';
import { jwtToken } from '../../utils/token.utils';

const serviceLogs = {
  logs: string(),
  timestamp: iso8601DateTimeWithMillis(),
  _links: { self: { href: 'http://localhost/api/administration/service-logs' } },
  _templates: { ...defaultTemplate },
};

export namespace GetServiceLogsPact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get service logs',
    withRequest: {
      method: HTTPMethods.GET,
      path: '/api/administration/service-logs',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['service-logs:read'] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: { ...serviceLogs },
    },
  };

  export const with_delete: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get service logs with delete',
    withRequest: {
      method: HTTPMethods.GET,
      path: '/api/administration/service-logs',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['service-logs:read', 'service-logs:delete'] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: {
        ...serviceLogs,
        _templates: {
          ...defaultTemplate,
          deleteServiceLogs: {
            method: 'DELETE',
            properties: [],
          },
        },
      },
    },
  };

  export const unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get service logs unauthorized',
    withRequest: {
      method: HTTPMethods.GET,
      path: '/api/administration/service-logs',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
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

export namespace DeleteServiceLogsPact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'delete',
    withRequest: {
      method: HTTPMethods.DELETE,
      path: '/api/administration/service-logs',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ authorities: ['service-logs:delete'] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: { ...serviceLogs },
    },
  };

  export const unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'delete service logs unauthorized',
    withRequest: {
      method: HTTPMethods.DELETE,
      path: '/api/administration/service-logs',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
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
