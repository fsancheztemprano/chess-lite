import { IResource, Resource } from '@hal-form-client';

export class Role extends Resource implements IResource {
  id?: string;
  name?: string;
}
