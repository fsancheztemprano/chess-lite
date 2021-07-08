export interface LoginInput {
  username: string;
  password: string;
}

export interface SignUpInput {
  username: string;
  password: string;
  email: string;
  firstname?: string;
  lastname?: string;
}

export enum HttpHeaders {
  'JWT_TOKEN' = 'Jwt-Token',
}
