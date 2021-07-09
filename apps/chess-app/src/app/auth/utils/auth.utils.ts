import jwt_decode from 'jwt-decode';

export function isTokenExpired(token: string | null): boolean {
  console.log('isTokenExpired', jwt_decode(token || ''));
  const decoded: { exp: number } = jwt_decode(token || '');
  return token ? Date.now() < Number(decoded.exp) : false;
}
