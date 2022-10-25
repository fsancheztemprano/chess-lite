import { IResource, Resource } from '@hal-form-client';

export class Authority extends Resource implements IResource {
  id?: string;
  name?: string;
}
