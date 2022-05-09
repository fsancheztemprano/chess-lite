import { sign } from 'jsonwebtoken';
import { isValidToken } from './auth.utils';

describe('Auth Utils', () => {
  describe('isTokenExpired', () => {
    it('should return true if token is not expired', () => {
      expect(isValidToken(sign({}, 'secret', { expiresIn: '1m' }))).toBe(true);
      expect(isValidToken(sign({}, 'secret', { expiresIn: '1s' }))).toBe(true);
    });

    it('should return false if token is expired', () => {
      expect(isValidToken(sign({}, 'secret', { expiresIn: '-1m' }))).toBe(false);
      expect(isValidToken(sign({}, 'secret', { expiresIn: '-1s' }))).toBe(false);
    });

    it.each([null, undefined, ''])('should return false if token is nullish (%p)', (falsy) => {
      expect(isValidToken(falsy)).toBe(false);
    });
  });
});
