import { IResource, Resource } from '@hal-form-client';
import { Page } from '../hateoas/pageable.model';
import { Authority } from './authority.model';
import { Role } from './role.model';

export interface UserInput {
  username: string;
  email: string;
  password: string;
  firstname?: string;
  lastname?: string;
  profileImageUrl?: string;
  roleId?: string;
  authorityIds?: string[];
  active?: boolean;
  locked?: boolean;
  expired?: boolean;
  credentialsExpired?: boolean;
}

export class User extends Resource implements IResource {
  id?: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  username?: string;
  profileImageUrl?: string;
  userPreferences?: UserPreferences;
  lastLoginDateDisplay?: Date;
  joinDate?: Date;
  role?: Role;
  authorities?: Authority[];
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
  page?: Page;
  override _embedded!: {
    userModels?: User[];
  };
}

export class UserPreferences extends Resource implements IResource {
  id?: string;
  darkMode?: boolean;
  contentLanguage?: string;
}
