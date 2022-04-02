import { User } from '../auth/user.model';

export interface Session {
  token?: string;
  user?: User;
}
