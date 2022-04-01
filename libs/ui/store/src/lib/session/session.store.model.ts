import { User, UserPreferences } from '@app/domain';

export interface SessionProps {
  user: User | null;
  userPreferences: UserPreferences | null;
}
