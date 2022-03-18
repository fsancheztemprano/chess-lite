import jwt_decode from 'jwt-decode';

export function isTokenExpired(token: string | null): boolean {
  if (!token?.length) {
    return true;
  }
  const decoded: { exp: number } = jwt_decode(token);
  return token ? Date.now() > Number(decoded.exp) * 1000 : false;
}

export function decodeToken(token: string | null): Token | null {
  if (!token?.length) {
    return null;
  }
  return jwt_decode(token);
}

export interface Token {
  aud: string;
  authorities: string[];
  exp: number;
  iat: number;
  iss: string;
  sub: string;
}
