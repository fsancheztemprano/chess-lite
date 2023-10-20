import { HttpHeaderKey } from '@app/ui/shared/domain';
import { ContentType } from '@hal-form-client';
import { InteractionObject } from '@pact-foundation/pact';
import { HTTPMethods } from '@pact-foundation/pact/src/common/request';

export namespace GetBuildInfoPact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get build info',
    withRequest: {
      method: HTTPMethods.GET,
      path: '/api/build-info',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: {
        _links: { self: { href: 'http://localhost/api/build-info' } },
        branch: 'devops/UM-60',
        date: '2022-10-23T13:20:09+0200',
        run: '420-1',
        stage: 'feature',
        version: '0.0.0-SNAPSHOT',
      },
    },
  };
}
