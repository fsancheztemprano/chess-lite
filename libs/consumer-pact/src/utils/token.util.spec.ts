import { jwtToken } from './token.util';

describe('Token Utils', () => {
  it('should create jwt token', () => {
    const token = jwtToken({
      user: { id: '51236253-7c7c-45e4-b7f5-304b3b66a43d', username: 'admin' },
      authorities: ['profile:read', 'profile:delete', 'profile:update'],
    });
    expect(token).toBeTruthy();
  });
});
