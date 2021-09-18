export interface LoginInput {
  username: string;
  password: string;
}

export interface SignupInput {
  username: string;
  password: string;
  email: string;
  firstname?: string;
  lastname?: string;
}

export enum HttpHeaders {
  'JWT_TOKEN' = 'Jwt-Token',
}

export interface AccountActivationInput {
  token: string;
  email: string;
  password: string;
}
