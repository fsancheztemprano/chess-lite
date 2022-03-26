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
    expiresIn: '2y',
    subject: payload.user.username,
  });
}
