export interface LoginInput {
  username: string;
  password: string;
}

export interface SignupInput {
  username: string;
  email: string;
  firstname?: string;
  lastname?: string;
}

export enum HttpHeaderKey {
  JWT_TOKEN = 'Jwt-Token',
  CONTENT_TYPE = 'Content-Type',
  ACCESS_CONTROL_EXPOSE_HEADERS = 'Access-Control-Expose-Headers',
}

export interface AccountActivationInput {
  token: string;
  email: string;
  password: string;
}

export const TOKEN_KEY = 'token';
