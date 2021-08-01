import { IResource, Resource } from '@chess-lite/hal-form-client';

export class Authority extends Resource implements IResource {
  id?: string;
  name?: string;
}
