import { User } from '../auth/user.model';

export interface Session {
  user?: User;
  token?: string | null;
  refreshToken?: string | null;
}
