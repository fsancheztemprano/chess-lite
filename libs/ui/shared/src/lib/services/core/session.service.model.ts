import { HttpResponse } from '@angular/common/http';
import { HttpHeaderKey, User } from '@app/domain';
import { IResource } from '@hal-form-client';

export interface Session {
  token?: string;
  user?: User;
}

export function httpToSession(response: HttpResponse<User>): Session {
  const token = response?.headers?.get(HttpHeaderKey.JWT_TOKEN) || '';
  const user = new User(response.body as IResource);
  return { token, user };
}
