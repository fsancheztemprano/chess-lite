import { InteractionObject } from '@pact-foundation/pact';
import { HTTPMethod } from '@pact-foundation/pact/src/common/request';

export namespace GetOneUserPacts {
  export const getOneUser: InteractionObject = {
    state: '',
    uponReceiving: '',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/user/u1',
    },
    willRespondWith: {
      status: 200,
      body: {
        msg: 's',
      },
    },
  };
}
