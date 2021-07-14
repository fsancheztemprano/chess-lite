import { IResource } from '@chess-lite/hal-form-client';

export interface User extends IResource {
  id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  profileImageUrl: string;
  lastLoginDateDisplay: Date;
  joinDate: Date;
  role: string;
  authorities: string[];
  active: boolean;
  locked: boolean;
  expired: boolean;
  credentialsExpired: boolean;
}

export interface UpdateUserProfileInput {
  firstname: string;
  lastname: string;
  profileImageUrl: string;
}
