import { TokenKeys } from '@app/ui/shared/domain';
import { randomUUID } from 'crypto';
import { sign } from 'jsonwebtoken';

export interface AuthUser {
  user?: {
    id?: string;
    username?: string;
  };
  authorities?: string[];
}

export function jwtToken(authUser: AuthUser = {}): string {
  const { user, authorities = [] } = authUser;
  const payload = {
    user: {
      id: user?.id || randomUUID(),
      username: user?.username || randomUUID().slice(0, 8),
    },
    authorities,
  };
  return sign(payload, 'secret', {
    algorithm: 'HS512',
    issuer: 'api',
    audience: 'app',
    expiresIn: '10y',
    subject: payload.user.username,
  });
}

export function setToken(authUser: AuthUser = {}): void {
  localStorage.setItem(TokenKeys.TOKEN, !authUser ? '' : jwtToken(authUser));
}
