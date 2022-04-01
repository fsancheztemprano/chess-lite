import { sign } from 'jsonwebtoken';
import { isTokenExpired } from './auth.utils';

describe('Auth Utils', () => {
  describe('isTokenExpired', () => {
    it('should return true if token is expired', () => {
      expect(isTokenExpired(sign({}, 'secret', { expiresIn: '-10m' }))).toBeTruthy();
    });

    it('should return false if token is not expired', () => {
      expect(isTokenExpired(sign({}, 'secret', { expiresIn: '2y' }))).toBeFalsy();
    });

    it('should return true if token is null or empty', () => {
      expect(isTokenExpired(null as never)).toBeTruthy();
      expect(isTokenExpired(undefined as never)).toBeTruthy();
      expect(isTokenExpired('')).toBeTruthy();
    });
  });
});
