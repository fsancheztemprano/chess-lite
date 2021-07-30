import { IResource, Resource } from '@chess-lite/hal-form-client';
import { Page } from '../hateoas/pageable.model';

export class User extends Resource implements IResource {
  id?: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  username?: string;
  profileImageUrl?: string;
  lastLoginDateDisplay?: Date;
  joinDate?: Date;
  role?: string;
  authorities?: string[];
  active?: boolean;
  locked?: boolean;
  expired?: boolean;
  credentialsExpired?: boolean;
}

export interface UserUpdateProfileInput {
  firstname: string;
  lastname: string;
  profileImageUrl: string;
}

export interface UserChangePasswordInput {
  password: string;
  newPassword: string;
}

export class UserPage extends Resource implements IResource {
  userModelList?: User[];
  page?: Page;
}
