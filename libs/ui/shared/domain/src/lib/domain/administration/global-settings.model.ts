import { Resource } from '@hal-form-client';
import { Role } from '../auth/role.model';

export class GlobalSettings extends Resource {
  defaultRole?: Role;
  signupOpen?: boolean;
}

export interface GlobalSettingsUpdateInput {
  defaultRoleId?: string;
  signupOpen?: boolean;
}
