import { IResource, Resource } from '@hal-form-client';
import { Page } from '../hateoas/pageable.model';
import { Authority } from './authority.model';

export class Role extends Resource implements IResource {
  id?: string;
  name?: string;
  authorities?: Authority[];
  coreRole?: boolean;
  canLogin?: boolean;
}

export interface RoleUpdateInput {
  name?: string;
  authorityIds?: string[];
  canLogin?: boolean;
}

export class RolePage extends Resource implements IResource {
  page?: Page;
  override _embedded!: {
    roleModels?: Role[];
  };
}
