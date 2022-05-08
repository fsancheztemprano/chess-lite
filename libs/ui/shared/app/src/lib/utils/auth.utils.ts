import jwt_decode from 'jwt-decode';

export function isValidToken(token?: string | null): boolean {
  if (!token?.length) {
    return false;
  }
  return !(Date.now() >= getTokenExpiration(token).valueOf() * 1000);
}

export function getTokenExpiration(token: string): Date {
  return new Date(jwt_decode<Token>(token).exp);
}

export interface Token {
  user: { id: string; username: string };
  authorities: string[];
  aud: string;
  exp: number;
  iat: number;
  iss: string;
  sub: string;
}
