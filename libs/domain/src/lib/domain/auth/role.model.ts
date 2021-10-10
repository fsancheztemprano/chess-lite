import { IResource, Resource } from '@hal-form-client';
import { Page } from '../hateoas/pageable.model';
import { Authority } from './authority.model';

export class Role extends Resource implements IResource {
  id?: string;
  name?: string;
  authorities?: Authority[];
}

export class RolePage extends Resource implements IResource {
  page?: Page;
  _embedded!: {
    roleModels?: Role[];
  };
}
