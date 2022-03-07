import { jwtToken } from './token.util';

describe('Token Utils', () => {
  it('should create jwt token', () => {
    const token = jwtToken({ authorities: ['role:read'] });
    expect(token).toBeTruthy();
  });
});
