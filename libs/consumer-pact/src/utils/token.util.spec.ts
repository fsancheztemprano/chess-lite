import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { jwtToken } from './token.util';

describe('Token Utils', () => {
  it('should create jwt token', () => {
    const authenticatedUser = {
      user: { id: '51236253-7c7c-45e4-b7f5-304b3b66a43d', username: 'admin' },
      authorities: ['profile:read', 'profile:delete', 'profile:update'],
    };
    const token = jwtToken(authenticatedUser);
    expect(token).toBeTruthy();

    const decodedToken: JwtPayload = <JwtPayload>jwt.verify(token, 'secret', { algorithms: ['HS512'] });

    expect(decodedToken).toBeTruthy();
    expect(decodedToken.user).toStrictEqual(authenticatedUser.user);
    expect(decodedToken.authorities).toStrictEqual(authenticatedUser.authorities);
  });
});
