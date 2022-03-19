import { User } from '@app/domain';

export interface Session {
  token?: string;
  user?: User;
}
