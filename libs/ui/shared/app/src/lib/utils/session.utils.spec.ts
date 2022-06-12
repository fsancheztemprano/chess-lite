import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpHeaderKey, User } from '@app/ui/shared/domain';
import { httpToSession } from './session.utils';

describe('Session Utils', () => {
  it('should map http response to Session', () => {
    const headers = new HttpHeaders({
      [HttpHeaderKey.JWT_TOKEN]: 'token',
      [HttpHeaderKey.JWT_REFRESH_TOKEN]: 'refreshToken',
    });
    const response = new HttpResponse<User>({
      body: {
        id: '1',
      } as User,
      headers,
    });

    const session = httpToSession(response);

    expect(session.token).toEqual('token');
    expect(session.refreshToken).toEqual('refreshToken');
    expect(session.user?.id).toEqual('1');
  });

  it('should map and handle missing tokens', () => {
    const response = new HttpResponse<User>({
      body: {
        id: '1',
      } as User,
    });

    const session = httpToSession(response);

    expect(session.token).toEqual('');
    expect(session.refreshToken).toEqual('');
    expect(session.user?.id).toEqual('1');
  });

  it('should map and handle nullish session', () => {
    const session = httpToSession({} as never);

    expect(session.token).toEqual('');
    expect(session.refreshToken).toEqual('');
    expect(session.user?.id).toBeUndefined();
  });
});
