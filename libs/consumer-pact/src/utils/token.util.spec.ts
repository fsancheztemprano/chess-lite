import { jwtToken } from './token.util';

describe('Token Utils', () => {
  it('should create jwt token', () => {
    const token = jwtToken({ authorities: ['user:read'] });
    expect(token).toBeTruthy();
  });
});
